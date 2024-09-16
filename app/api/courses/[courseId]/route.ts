import { Course } from "@prisma/client";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { utDeleteFile } from "@/lib/ulapi";

type UpdateData = Partial<Course>;

type Params = {
    params: { courseId: string };
};

export async function PATCH(req: Request, { params }: Params) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;

        const ownerCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!ownerCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const values: UpdateData = await req.json();

        if (values.imageUrl && ownerCourse.imageUrl) {
            await utDeleteFile(ownerCourse.imageUrl);
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("🚀 [COURSE_ID] ~ PATCH ~ error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
