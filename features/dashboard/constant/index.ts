import { TRoute } from "../types";

import { BarChart, Compass, Layout, List } from "lucide-react";

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
