import { CourseWithChapter } from "../_types";

import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { ChapterSidebar } from "./chapter-sidebar";

type Props = {
    course: CourseWithChapter;
    progressCount: number;
};

export const CourseSidebar = async ({ course, progressCount }: Props) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id,
            },
        },
    });

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 h-20 flex flex-col border-b">
                <h1 className="font-semibold">{course.title}</h1>
                {/* Add progress */}
            </div>

            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <ChapterSidebar
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    );
};