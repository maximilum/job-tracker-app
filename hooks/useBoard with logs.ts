"use client";
import { useState } from "react";

import { Board, JobApplication } from "@/lib/models";
import {
  Board as BoardI,
  Column as ColumnI,
  JobApplication as JobApplicationI,
} from "@/lib/models/models.types";

export function useBoard(boardDoc: BoardI) {
  boardDoc.columns.sort((a, b) => a.order - b.order);
  boardDoc.columns.forEach((col) => {
    col.jobApplications.sort((a, b) => a.order - b.order);
  });
  const [board, setBoard] = useState<BoardI>(boardDoc);

  const moveJob = (jobId: string | number, targetId: string | number) => {
    let targetColumnId: string | undefined;
    let targetJob: JobApplicationI | undefined;
    let targetName: string = String(targetId);

    // Find the dragged job's name for logging
    const draggedJob = board.columns
      .flatMap((col) => col.jobApplications)
      .find((job) => job._id === jobId);
    const draggedJobName = draggedJob ? `${draggedJob.company} (${draggedJob.position})` : String(jobId);

    console.log(`\n[moveJob] 🚀 Initiated move for: "${draggedJobName}"`);

    for (const column of board.columns) {
      if (column._id === targetId) {
        targetColumnId = column._id;
        targetName = `Column: "${column.name}"`;
        break;
      }
      for (const job of column.jobApplications) {
        if (job._id === targetId) {
          targetJob = job;
          targetName = `Job: "${job.company} (${job.position})"`;
          break;
        }
      }
      if (targetJob) break;
    }

    if (!targetColumnId && !targetJob) {
      console.log(`[moveJob] 🛑 Return early: No target column or target job found for target: ${targetName}`);
      return;
    }
    
    if (targetJob && targetJob._id === jobId) {
      console.log(`[moveJob] 🛑 Return early: Target job is the same as dragged job "${draggedJobName}"`);
      return;
    }

    setBoard((prevBoard) => {
      const newBoard = structuredClone(prevBoard);
      const columns = newBoard.columns;
      const originalColumn = columns.find((col) => {
        return col.jobApplications.some((job) => job._id === jobId);
      });
      
      if (!originalColumn) {
        console.log(`[moveJob] ❌ Error: Original column for "${draggedJobName}" not found`);
        return prevBoard;
      }

      const job = originalColumn?.jobApplications.find(
        (job) => job._id === jobId,
      );
      
      if (!job) {
        console.log(`[moveJob] ❌ Error: Job "${draggedJobName}" not found in its original column`);
        return prevBoard;
      }

      if (targetColumnId) {
        console.log(`[moveJob] 🔄 Action: Moving "${draggedJobName}" into ${targetName}`);
        const targetColumn = columns.find((col) => col._id === targetColumnId);
        
        if (!targetColumn) {
          console.log(`[moveJob] ❌ Error: ${targetName} not found in board`);
          return prevBoard;
        }
        
        // Remove job from the origianl column
        originalColumn.jobApplications = originalColumn?.jobApplications.filter(
          (job) => job._id !== jobId,
        );
        // Add job to the end of target column
        targetColumn.jobApplications.push(job);
        console.log(`[moveJob] ✅ Success: "${draggedJobName}" moved to the end of ${targetName}`);
        
        // Re-calculate local orders to prevent UI from snapping back
        originalColumn.jobApplications.forEach((j, i) => (j.order = i * 100));
        targetColumn.jobApplications.forEach((j, i) => (j.order = i * 100));

      } else if (targetJob) {
        console.log(`[moveJob] 🔄 Action: Moving "${draggedJobName}" over ${targetName}`);
        const targetColumn = columns.find((col) =>
          col.jobApplications.some((job) => job._id === targetJob._id),
        );

        if (!targetColumn) {
          console.log(`[moveJob] ❌ Error: Column containing ${targetName} not found`);
          return prevBoard;
        }
        
        // Remove job from the origianl column
        originalColumn.jobApplications = originalColumn?.jobApplications.filter(
          (job) => job._id !== jobId,
        );
        // Add job to the index of thetargetJob
        const targetJobIndex = targetColumn.jobApplications.findIndex(
          (job) => job._id === targetJob._id,
        );
        targetColumn.jobApplications.splice(targetJobIndex, 0, job);
        console.log(`[moveJob] ✅ Success: "${draggedJobName}" moved to index ${targetJobIndex} in Column: "${targetColumn.name}"`);
        
    
      }
      return newBoard;
    });
  };
  return { board, moveJob };
}
