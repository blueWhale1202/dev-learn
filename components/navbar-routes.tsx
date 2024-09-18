"use client";

import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchInput } from "./search-input";
import { Button } from "./ui/button";

export const NavbarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname.startsWith("/teacher");
    const isCoursePage = pathname.includes("/courses");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <nav className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Button size="sm" variant="ghost" asChild>
                        <Link href="/">
                            <LogOut className="size-4 mr-2" />
                            Exit
                        </Link>
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="text-sm"
                    >
                        <Link href="/teacher/courses">Teacher mode</Link>
                    </Button>
                )}
                <UserButton />
            </nav>
        </>
    );
};
