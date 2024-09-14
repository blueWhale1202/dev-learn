import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Params = {
    params: { courseId: string; attachmentId: string };
};
export async function DELETE(req: Request, { params }: Params) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, attachmentId } = params;

        const isCourseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!isCourseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId,
                id: attachmentId,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("🚀 [ATTACHMENT_ID] ~ DELETE ~ error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
