import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";

type Props = {
    params: {
        courseId: string;
        chapterId: string;
    };
};

const ChapterPage = async ({ params }: Props) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    const { chapterId, courseId } = params;

    const {
        course,
        chapter,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        courseId,
        chapterId,
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant="success"
                    label="You already completed this chapter"
                />
            )}
            {isLocked && (
                <Banner
                    variant="warning"
                    label="You need to purchase this course to watch this chapter"
                />
            )}

            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        playbackId={muxData?.playbackId!}
                        title={chapter.title}
                        chapterId={chapterId}
                        courseId={courseId}
                        nextChapterId={nextChapter?.id}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChapterPage;
