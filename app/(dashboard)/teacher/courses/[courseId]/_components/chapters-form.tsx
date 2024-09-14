"use client";

import { Chapter, Course } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PlusCircle } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCreateChapter } from "../_hooks/use-create-chapter";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
};

export const ChaptersForm = ({ initialData, courseId }: Props) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const inputId = useId();

    const defaultValues = {
        title: "",
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { mutate, isPending } = useCreateChapter(courseId);
    const router = useRouter();

    const onToggle = () => {
        form.reset(defaultValues);
        setIsCreating(!isCreating);
    };

    const onSubmit = async (values: FormValues) => {
        const position = initialData.chapters.length + 1;

        console.log({
            ...values,
            position,
        });

        mutate(
            { ...values, position },
            {
                onSuccess() {
                    onToggle();
                    toast.success("Chapter created");
                    router.refresh();
                },
            }
        );
    };

    return (
        <div className="mt-6 p-4 border bg-slate-100 rounded-md shadow-md">
            <div className="flex items-center justify-between">
                <Label htmlFor={inputId} className="text-base font-medium">
                    Course description
                </Label>
                <Button variant="ghost" onClick={onToggle}>
                    {isCreating ? (
                        "Cancel"
                    ) : (
                        <>
                            <PlusCircle className="size-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>

            <div className="space-y-2">
                {!isCreating && (
                    <div
                        className={cn(
                            "text-sm",
                            !initialData.chapters.length &&
                                "text-slate-500 italic"
                        )}
                    >
                        {!initialData.chapters.length
                            ? "No chapters"
                            : "TODO: Add a list chapter"}
                    </div>
                )}

                {!isCreating && (
                    <p className="text-xs text-muted-foreground">
                        Drag and drop to reorder the chapters
                    </p>
                )}
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 mt-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id={inputId}
                                                    className="bg-white"
                                                    placeholder="e.g. 'Introduction to the course'"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center justify-end">
                                    <Button type="submit" disabled={isPending}>
                                        Create
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
