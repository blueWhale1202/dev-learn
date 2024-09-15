import { Chapter } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { utapi } from "@/lib/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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
                await video.assets.delete(existingMuxData.assetId);

                const fileName = values.videoUrl.split("/").pop();
                await utapi.deleteFiles(fileName || "");
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }

            const asset = await video.assets.create({
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
