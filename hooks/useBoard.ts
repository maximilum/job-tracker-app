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

    for (const column of board.columns) {
      if (column._id === targetId) {
        targetColumnId = column._id;
        break;
      }
      for (const job of column.jobApplications) {
        if (job._id === targetId) {
          targetJob = job;
          break;
        }
      }
      if (targetJob) break;
    }
    if (!targetColumnId && !targetJob) return;
    if (targetJob && targetJob._id === jobId) return;

    setBoard((prevBoard) => {
      const newBoard = structuredClone(prevBoard);
      const columns = newBoard.columns;
      const originalColumn = columns.find((col) => {
        return col.jobApplications.some((job) => job._id === jobId);
      });
      if (!originalColumn) return prevBoard;

      const job = originalColumn?.jobApplications.find(
        (job) => job._id === jobId,
      );
      if (!job) return prevBoard;
      // Case #1:target is a column
      if (targetColumnId) {
        const targetColumn = columns.find((col) => col._id === targetColumnId);
        if (!targetColumn) return prevBoard;
        // Remove job from the origianl column
        originalColumn.jobApplications = originalColumn?.jobApplications.filter(
          (job) => job._id !== jobId,
        );
        // Add job to the end of target column
        targetColumn.jobApplications.push(job);
      } 
      // Case #2: Target is a job
      else if (targetJob) {
        const targetColumn = columns.find((col) =>
          col.jobApplications.some((job) => job._id === targetJob._id),
        );
        if (!targetColumn) return prevBoard;
        // Case #2.1 : job moved in the same column
        if(targetColumn === originalColumn){
          const originalIndex = originalColumn.jobApplications.findIndex(job => job._id === jobId)
          const targetJobIndex = originalColumn.jobApplications.findIndex(job => job._id === targetJob._id)
          // Case #2.1.1 : job moved up
          if(targetJobIndex < originalIndex){
            // Remove job from the original column
          originalColumn.jobApplications = originalColumn?.jobApplications.filter(
            (job) => job._id !== jobId,
          );
          // Add job to the index of the targetJob
          targetColumn.jobApplications.splice(targetJobIndex, 0, job);
          }
          // Case #2.1.2 : job moved down
          else{
            // Remove job from the original column
          originalColumn.jobApplications = originalColumn?.jobApplications.filter(
            (job) => job._id !== jobId,
          );
          // Add job to the index of the targetJob
          targetColumn.jobApplications.splice(targetJobIndex, 0, job);
          }
        }
        // Case #2.2 : job moved to a new column
        else{
          // Remove job from the origianl column
          originalColumn.jobApplications = originalColumn?.jobApplications.filter(
            (job) => job._id !== jobId,
          );
          // Add job to the index of thetargetJob
          const targetJobIndex = targetColumn.jobApplications.findIndex(
            (job) => job._id === targetJob._id,
          );
          targetColumn.jobApplications.splice(targetJobIndex, 0, job);
        }

      }
      return newBoard;
    });
  };
  return { board, moveJob };
}
