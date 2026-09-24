"use client";

import React, { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Award } from "lucide-react";
import JobApplicationCard from "./ui/JobApplicationCard";
import type { JobApplication } from "@/lib/models/models.types";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/* Mock data: realistic Gulf tech market, fully local, zero server calls */

interface DemoColumn {
  id: string;
  nameAr: string;
  nameEn: string;
  isAccent?: boolean;
}

const DEMO_COLUMNS: DemoColumn[] = [
  { id: "wishlist", nameAr: "قائمة الرغبات", nameEn: "Wishlist" },
  { id: "applied", nameAr: "تم التقديم", nameEn: "Applied" },
  { id: "interviews", nameAr: "المقابلات", nameEn: "Interviews" },
  { id: "offer", nameAr: "عرض وظيفي", nameEn: "Offer", isAccent: true },
];

interface DemoJob {
  id: string;
  columnId: string;
  company: string;
  positionAr: string;
  positionEn: string;
  locationAr?: string;
  locationEn?: string;
  salaryAr?: string;
  salaryEn?: string;
  tags?: string[];
}

const INITIAL_JOBS: DemoJob[] = [
  {
    id: "j1",
    columnId: "wishlist",
    company: "تابي Tabby",
    positionAr: "مهندس واجهات أول",
    positionEn: "Senior Frontend Engineer",
    locationAr: "الرياض",
    locationEn: "Riyadh",
    salaryAr: "35,000 ر.س",
    salaryEn: "SAR 35,000",
    tags: ["React", "TypeScript"],
  },
  {
    id: "j2",
    columnId: "wishlist",
    company: "نون noon",
    positionAr: "مصمم منتجات",
    positionEn: "Product Designer",
    locationAr: "دبي",
    locationEn: "Dubai",
    tags: ["Figma"],
  },
  {
    id: "j3",
    columnId: "applied",
    company: "كريم Careem",
    positionAr: "مهندس واجهات",
    positionEn: "Frontend Engineer",
    locationAr: "دبي",
    locationEn: "Dubai",
    salaryAr: "30,000 ر.س",
    salaryEn: "SAR 30,000",
    tags: ["React", "GraphQL"],
  },
  {
    id: "j4",
    columnId: "applied",
    company: "إس تي سي stc",
    positionAr: "مهندس برمجيات",
    positionEn: "Software Engineer",
    locationAr: "الرياض",
    locationEn: "Riyadh",
    tags: ["Next.js", "Node.js"],
  },
  {
    id: "j5",
    columnId: "applied",
    company: "جاهز Jahez",
    positionAr: "مهندس تطبيقات",
    positionEn: "Mobile Engineer",
    locationAr: "الرياض",
    locationEn: "Riyadh",
  },
  {
    id: "j6",
    columnId: "interviews",
    company: "تمارا Tamara",
    positionAr: "مطور واجهات",
    positionEn: "Frontend Developer",
    locationAr: "الرياض",
    locationEn: "Riyadh",
    salaryAr: "25,000 ر.س",
    salaryEn: "SAR 25,000",
    tags: ["React"],
  },
  {
    id: "j7",
    columnId: "interviews",
    company: "سلة Salla",
    positionAr: "مهندس منتج",
    positionEn: "Product Engineer",
    locationAr: "عن بُعد",
    locationEn: "Remote",
    tags: ["Vue", "TypeScript"],
  },
  {
    id: "j8",
    columnId: "offer",
    company: "فودكس Foodics",
    positionAr: "مهندس واجهات أول",
    positionEn: "Senior Frontend Engineer",
    locationAr: "الرياض",
    locationEn: "Riyadh",
    salaryAr: "32,000 ر.س",
    salaryEn: "SAR 32,000",
    tags: ["React", "GraphQL"],
  },
];

function toCardView(job: DemoJob, lang: "ar" | "en"): JobApplication {
  return {
    _id: job.id,
    company: job.company,
    position: lang === "ar" ? job.positionAr : job.positionEn,
    location: lang === "ar" ? job.locationAr : job.locationEn,
    salary: lang === "ar" ? job.salaryAr : job.salaryEn,
    tags: job.tags,
    status: job.columnId,
    columnId: job.columnId,
    boardId: "demo",
    userId: "demo",
    order: 0,
  };
}

/* Sortable demo card: real JobApplicationCard visuals, local drag state */

const SortableDemoCard = ({
  job,
  lang,
}: {
  job: DemoJob;
  lang: "ar" | "en";
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id, data: { type: "job", job } });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-manipulation active:cursor-grabbing"
    >
      <JobApplicationCard job={toCardView(job, lang)} />
    </div>
  );
};

/* Neutral column. The single accent lives on the Offer column only. */

const DemoColumnView = ({
  column,
  jobs,
  lang,
}: {
  column: DemoColumn;
  jobs: DemoJob[];
  lang: "ar" | "en";
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 snap-start flex-col rounded-xl border bg-muted/40 p-2.5 transition-colors ${
        isOver ? "border-primary/50" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between px-1.5 pt-1 pb-2">
        <div className="flex items-center gap-1.5">
          {column.isAccent && <Award className="size-4 text-primary" />}
          <h3
            className={`text-sm font-semibold ${
              column.isAccent ? "text-primary" : "text-foreground"
            }`}
          >
            {lang === "ar" ? column.nameAr : column.nameEn}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {jobs.length}
        </span>
      </div>

      <SortableContext
        items={jobs.map((j) => j.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-24 flex-col gap-2">
          {jobs.map((job) => (
            <SortableDemoCard key={job.id} job={job} lang={lang} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

/* Demo board: same dnd-kit wiring as the real board, local state only */

const DemoBoard = () => {
  const { language } = useLanguage();
  const lang: "ar" | "en" = language === "ar" ? "ar" : "en";

  const [jobs, setJobs] = useState<DemoJob[]>(INITIAL_JOBS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const baselineRef = useRef<DemoJob[] | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  const activeJob = jobs.find((j) => j.id === activeId);

  function moveJob(jobId: string, targetId: string) {
    setJobs((prev) => {
      const job = prev.find((j) => j.id === jobId);
      if (!job) return prev;

      const overJob = prev.find((j) => j.id === targetId);
      const targetColumnId = overJob ? overJob.columnId : targetId;
      if (!DEMO_COLUMNS.some((c) => c.id === targetColumnId)) return prev;

      // Reorder within the same column
      if (job.columnId === targetColumnId && overJob && overJob.id !== job.id) {
        const columnJobs = prev.filter((j) => j.columnId === targetColumnId);
        const others = prev.filter((j) => j.columnId !== targetColumnId);
        const from = columnJobs.findIndex((j) => j.id === jobId);
        const to = columnJobs.findIndex((j) => j.id === overJob.id);
        const reordered = [...columnJobs];
        reordered.splice(from, 1);
        reordered.splice(to, 0, job);
        return [...others, ...reordered];
      }

      // Move across columns
      if (job.columnId !== targetColumnId) {
        const moved = { ...job, columnId: targetColumnId };
        const without = prev.filter((j) => j.id !== jobId);
        if (overJob) {
          const targetJobs = without.filter(
            (j) => j.columnId === targetColumnId,
          );
          const others = without.filter((j) => j.columnId !== targetColumnId);
          const to = targetJobs.findIndex((j) => j.id === overJob.id);
          const merged = [...targetJobs];
          merged.splice(to < 0 ? merged.length : to, 0, moved);
          return [...others, ...merged];
        }
        return [...without, moved];
      }

      return prev;
    });
  }

  function handleDragStart(event: DragStartEvent) {
    baselineRef.current = jobs;
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const jobId = event.active?.id as string;
    const targetId = event.over?.id as string | undefined;
    if (!jobId || !targetId || jobId === targetId) return;
    moveJob(jobId, targetId);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    if (!event.over && baselineRef.current) setJobs(baselineRef.current);
    baselineRef.current = null;
  }

  function handleDragCancel() {
    if (baselineRef.current) setJobs(baselineRef.current);
    baselineRef.current = null;
    setActiveId(null);
  }

  return (
    <div className="flex snap-x snap-proximity items-start gap-3 overflow-x-auto pb-2 lg:snap-none">
      <DndContext
        id="demo-board-dnd-context"
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {DEMO_COLUMNS.map((column) => (
          <DemoColumnView
            key={column.id}
            column={column}
            jobs={jobs.filter((j) => j.columnId === column.id)}
            lang={lang}
          />
        ))}

        <DragOverlay>
          {activeJob ? (
            <JobApplicationCard job={toCardView(activeJob, lang)} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DemoBoard;

