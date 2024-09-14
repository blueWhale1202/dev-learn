"use client";

import { Attachment, Course } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { FileUpload } from "@/components/file-upload";

import { FileIcon, Loader, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

import { useCreateAttachment } from "../_hooks/use-create-attachment";
import { useDeleteAttachment } from "../_hooks/use-delete-attachment";

type Props = {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
};

export const AttachmentForm = ({ initialData, courseId }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const createAttachment = useCreateAttachment(courseId);
    const deleteAttachment = useDeleteAttachment(courseId);

    const router = useRouter();

    const onToggle = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit = async (values: { url: string }) => {
        console.log(values);
        createAttachment.mutate(values, {
            onSuccess() {
                onToggle();
                toast.success("Attachment created");
                router.refresh();
            },
        });
    };

    const onDelete = (id: string) => {
        console.log(id);

        setDeletingId(id);
        deleteAttachment.mutate(id, {
            onSuccess() {
                toast.success("Attachment deleted");
                router.refresh();
            },
            onSettled() {
                setDeletingId(null);
            },
        });
    };

    return (
        <div className="mt-6 p-4 border bg-slate-100 rounded-md shadow-md">
            <div className="flex items-center justify-between">
                <p className="text-base font-medium">Course attachments</p>
                <Button variant="ghost" onClick={onToggle}>
                    {isEditing && "Cancel"}

                    {!isEditing && (
                        <>
                            <PlusCircle className="size-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                initialData.attachments.length === 0 ? (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No attachments yet
                    </p>
                ) : (
                    <div className="space-y-2 mt-2">
                        {initialData.attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md"
                            >
                                <FileIcon className="size-4 mr-2 flex-shrink-0" />
                                <p className="text-xs line-clamp-1">
                                    {attachment.name}
                                </p>

                                {deletingId === attachment.id ? (
                                    <Loader className="size-4 animate-spin ml-auto" />
                                ) : (
                                    <button
                                        className="ml-auto hover:opacity-75 transition"
                                        onClick={() => onDelete(attachment.id)}
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => onSubmit({ url: url })}
                    />

                    <p className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete the
                        course
                    </p>
                </div>
            )}
        </div>
    );
};
