import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { IconBadge } from "@/components/icon-badge";
import {
    CircleDollarSign,
    FileIcon,
    LayoutDashboard,
    ListCheck,
} from "lucide-react";

import { AttachmentForm } from "./_components/attachment-form";
import { CategoryForm } from "./_components/category-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { TitleForm } from "./_components/title-form";

type Props = {
    params: { courseId: string };
};

const CoursePage = async ({ params }: Props) => {
    const { courseId } = params;

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            attachments: {
                orderBy: [
                    {
                        updateAt: "desc",
                    },
                    {
                        createAt: "desc",
                    },
                ],
            },
        },
    });
    console.log("🚀 ~ CoursePage ~ course:", course);

    if (!course) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    const categoryOptions = categories.map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const { title, description, imageUrl, price, categoryId } = course;

    const requiredFields = [title, description, imageUrl, price, categoryId];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course setup</h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields ({completedFields}/{totalFields})
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Customize your course</h2>
                    </div>

                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categoryOptions}
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl">Course chapters</h2>
                        </div>
                        <div>TODO: Chapters</div>
                    </div>

                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">Sell your course</h2>
                        </div>

                        <PriceForm initialData={course} courseId={course.id} />
                    </div>

                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={FileIcon} />
                            <h2 className="text-xl">Resources & Attachments</h2>
                        </div>

                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;
