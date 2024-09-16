"use client";

import { Course } from "@prisma/client";
import { Row } from "@tanstack/react-table";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, Loader, MoreHorizontal, Trash } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteCourse } from "../[courseId]/_hooks/use-delete-course";

interface Props<TData> {
    row: Row<TData>;
}

export function TableRowActions<TData>({ row }: Props<TData>) {
    const { confirm, ConfirmDialog } = useConfirm(
        "Are you sure delete this course"
    );

    const { id } = row.original as Course;
    const { mutate, isPending } = useDeleteCourse();

    const router = useRouter();

    const onDelete = async () => {
        const ok = await confirm();

        if (!ok) return;

        mutate(id, {
            onSuccess() {
                toast.success("Course deleted");
                router.refresh();
            },
        });
    };

    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isPending}>
                        {isPending ? (
                            <Loader className="size-4 animate-spin" />
                        ) : (
                            <MoreHorizontal className="size-4" />
                        )}
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild disabled={isPending}>
                        <Link href={`/teacher/courses/${id}`}>
                            <Edit className="size-4 mr-2" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="text-rose-500"
                        disabled={isPending}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
