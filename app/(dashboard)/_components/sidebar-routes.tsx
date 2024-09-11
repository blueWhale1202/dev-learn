"use client";

import { usePathname } from "next/navigation";
import { guestRoutes, teacherRoutes } from "../_constant";

import { SidebarItem } from "./sidebar-item";

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname.includes("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    icon={route.icon}
                />
            ))}
        </div>
    );
};
