import { Chapter } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { muxCreateAsset, muxDeleteAsset } from "@/lib/mux";
import { utDeleteFile } from "@/lib/ulapi";

type UpdateData = Partial<Chapter>;

type Params = {
    params: { courseId: string; chapterId: string };
};

export async function PATCH(req: Request, { params }: Params) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = params;

        const isOwnerChapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                userId,
            },
        });

        if (!isOwnerChapter) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { isPublished, ...values }: UpdateData = await req.json();

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                userId,
                courseId,
            },
            data: {
                ...values,
            },
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId,
                },
            });

            if (existingMuxData) {
                await muxDeleteAsset(existingMuxData.assetId);
                await Promise.all([
                    await utDeleteFile(values.videoUrl),
                    await db.muxData.delete({
                        where: {
                            id: existingMuxData.id,
                        },
                    }),
                ]);
            }

            const asset = await muxCreateAsset({
                input: [{ url: values.videoUrl }],
                playback_policy: ["public"],
                test: false,
            });

            await db.muxData.create({
                data: {
                    chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                },
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("🚀 [CHAPTER_ID] ~ PATCH ~ error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: Params) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = params;

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                userId,
                courseId,
            },
        });

        if (!chapter) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId,
                },
            });

            if (existingMuxData) {
                await muxDeleteAsset(existingMuxData.assetId);

                await Promise.all([
                    await utDeleteFile(chapter.videoUrl),
                    await db.muxData.delete({
                        where: {
                            id: existingMuxData.id,
                        },
                    }),
                ]);
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                userId,
                courseId,
                id: chapterId,
            },
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                },
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("🚀 [CHAPTER_ID] ~ DELETE ~ error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
