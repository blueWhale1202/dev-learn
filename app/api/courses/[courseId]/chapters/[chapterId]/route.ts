import { Chapter } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

        // TODO: Upload video

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("🚀 [CHAPTER_ID] ~ PATCH ~ error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
