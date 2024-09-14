import { Chapter } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Params = {
    params: { courseId: string };
};

type UpdateData = { list: Pick<Chapter, "id" | "position">[] };

export async function PUT(req: Request, { params }: Params) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;

        const isCourseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!isCourseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list }: UpdateData = await req.json();

        for (const item of list) {
            await db.chapter.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position,
                },
            });
        }

        return new NextResponse("Reorder success", { status: 200 });
    } catch (error) {
        console.log("🚀 [COURSE_ID_CHAPTERS] ~ POST ~ error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
