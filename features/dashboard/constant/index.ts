import { TRoute } from "../types";

import { BarChart, Compass, Layout, List, MessageSquare } from "lucide-react";

export const guestRoutes: TRoute[] = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    },
    {
        icon: MessageSquare,
        label: "Forum",
        href: process.env.NEXT_PUBLIC_FORUM_URL!,
    },
];

export const teacherRoutes: TRoute[] = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    },
];
