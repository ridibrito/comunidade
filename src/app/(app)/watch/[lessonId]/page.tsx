import WatchLessonClient from "./watch-lesson-client";

export default async function WatchPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <WatchLessonClient lessonId={lessonId} />;
}


