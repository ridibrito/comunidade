"use client";

import Image from "next/image";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

interface CardCourseProps {
  title: string;
  lessons: number;
  progress?: number;
  image?: string;
  tag?: string;
  className?: string;
}

export function CardCourse({ title, lessons, progress = 0, image = "/next.svg", tag = "Novo", className }: CardCourseProps) {
  return (
    <div className={cn("group rounded-2xl bg-[var(--surface)] border p-3 shadow-sm hover:shadow transition-all duration-300 ease-in-out hover:scale-[1.01] border-[var(--border)]", className)}>
      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-[var(--hover)]">
        <Image src={image} alt={title} fill className="object-contain p-6" />
        <div className="absolute top-3 left-3 text-xs bg-[var(--accent-purple)]/15 text-[var(--foreground)] px-2 py-1 rounded-full border border-[var(--accent-purple)]/30">{tag}</div>
      </div>
      <div className="mt-3">
        <h3 className="text-[18px] font-semibold tracking-tight text-[var(--foreground)] line-clamp-2">{title}</h3>
        <p className="text-sm text-[var(--foreground)]/70 mt-1">{lessons} aulas</p>
        <div className="mt-3">
          <Progress value={progress} />
        </div>
      </div>
    </div>
  );
}


