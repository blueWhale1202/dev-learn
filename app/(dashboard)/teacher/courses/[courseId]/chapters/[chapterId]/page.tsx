import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterTitleForm } from "./_components/chapter-title-form";

type Props = {
    params: {
        courseId: string;
        chapterId: string;
    };
};

const ChapterPage = async ({ params }: Props) => {
    const { courseId, chapterId } = params;

    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            userId,
            courseId,
            id: chapterId,
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) {
        redirect("/");
    }

    const { title, description, videoUrl } = chapter;
    const requiredFields = [title, description, videoUrl];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to course setup
                    </Link>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Chapter Creation
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields ({completedFields}/
                                {totalFields})
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Customize your chapter</h2>
                        </div>

                        <ChapterTitleForm
                            initialData={chapter}
                            chapterId={chapterId}
                            courseId={courseId}
                        />

                        <ChapterDescriptionForm
                            initialData={chapter}
                            chapterId={chapterId}
                            courseId={courseId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterPage;
