import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { getCourses } from "@/actions/get-courses";
import { SearchInput } from "@/components/search-input";
import { Categories } from "./_components/categories";
import { CourseList } from "./_components/course-list";

type Props = {
    searchParams: {
        title: string;
        categoryId: string;
    };
};

export default async function SearchPage({ searchParams }: Props) {
    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    const { title, categoryId } = searchParams;

    const courses = await getCourses({
        userId,
        title,
        categoryId,
    });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories items={categories} />
                <CourseList items={courses} />
            </div>
        </>
    );
}
