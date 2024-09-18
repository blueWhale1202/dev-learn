"use client";

import { useState } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import { cn } from "@/lib/utils";
import { Loader, Lock } from "lucide-react";

import MuxPlayer from "@mux/mux-player-react";

type Props = {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
};

export const VideoPlayer = ({
    playbackId,
    title,
    courseId,
    chapterId,
    completeOnEnd,
    isLocked,
    nextChapterId,
}: Props) => {
    const [isReady, setIsReady] = useState(false);
    return (
        <AspectRatio ratio={16 / 9} className="relative">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader className="size-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="size-8" />
                    <p className="text-sm">This chapter is locked</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={() => {}}
                    playbackId={playbackId}
                />
            )}
        </AspectRatio>
    );
};
