import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Params = {
    params: { courseId: string };
};
export async function POST(req: Request, { params }: Params) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;
        const { url }: { url: string } = await req.json();

        const isCourseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!isCourseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                courseId,
                name: url.split("/").pop() || url,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("🚀 [COURSE_ID_ATTACHMENTS] ~ PATCH ~ error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
