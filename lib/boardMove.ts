import { arrayMove } from "@dnd-kit/sortable";
import { Board, Column } from "./models/models.types";

export interface MoveUpdate {
  jobId: string;
  newColumnId: string;
  order: number;
}

export interface BoardMoveResult {
  board: Board;
  update: MoveUpdate;
}

export function computeBoardMove(
  board: Board,
  jobIdInput: string | number,
  targetIdInput: string | number,
): BoardMoveResult | null {
  const jobId = String(jobIdInput);
  const targetId = String(targetIdInput);

  if (jobId === targetId) return null;

  // Clone board immutably
  const newBoard: Board = {
    ...board,
    columns: board.columns.map((col) => ({
      ...col,
      jobApplications: col.jobApplications.map((j) => ({ ...j })),
    })),
  };

  // Find source column and job
  let sourceCol: Column | undefined;
  let jobIndex = -1;

  for (const col of newBoard.columns) {
    const idx = col.jobApplications.findIndex((j) => String(j._id) === jobId);
    if (idx !== -1) {
      sourceCol = col;
      jobIndex = idx;
      break;
    }
  }

  if (!sourceCol || jobIndex === -1) return null;
  const [jobToMove] = sourceCol.jobApplications.splice(jobIndex, 1);
  if (!jobToMove) return null;

  // Check if target is a column ID
  const targetColById = newBoard.columns.find(
    (col) => String(col._id) === targetId,
  );

  if (targetColById) {
    // Moved onto a column directly (append to end)
    jobToMove.columnId = String(targetColById._id);
    targetColById.jobApplications.push(jobToMove);

    // Re-densify both columns' orders
    sourceCol.jobApplications.forEach((j, idx) => {
      j.order = idx;
    });
    targetColById.jobApplications.forEach((j, idx) => {
      j.order = idx;
    });

    const newOrder = targetColById.jobApplications.length - 1;

    return {
      board: newBoard,
      update: {
        jobId,
        newColumnId: String(targetColById._id),
        order: newOrder,
      },
    };
  }

  // Target is another job ID
  let targetCol: Column | undefined;
  let targetJobIndex = -1;

  // Put job back temporarily to locate target accurately
  sourceCol.jobApplications.splice(jobIndex, 0, jobToMove);

  for (const col of newBoard.columns) {
    const idx = col.jobApplications.findIndex(
      (j) => String(j._id) === targetId,
    );
    if (idx !== -1) {
      targetCol = col;
      targetJobIndex = idx;
      break;
    }
  }

  if (!targetCol || targetJobIndex === -1) return null;

  // Case 1: Same column move using arrayMove (kills off-by-one [2.7])
  if (sourceCol._id === targetCol._id) {
    if (jobIndex === targetJobIndex) return null;

    targetCol.jobApplications = arrayMove(
      targetCol.jobApplications,
      jobIndex,
      targetJobIndex,
    );

    targetCol.jobApplications.forEach((j, idx) => {
      j.order = idx;
    });

    return {
      board: newBoard,
      update: {
        jobId,
        newColumnId: String(targetCol._id),
        order: targetJobIndex,
      },
    };
  }

  // Case 2: Cross column move onto target card
  // Remove from source column
  sourceCol.jobApplications.splice(jobIndex, 1);
  sourceCol.jobApplications.forEach((j, idx) => {
    j.order = idx;
  });

  // Insert into target column at targetJobIndex
  jobToMove.columnId = String(targetCol._id);
  targetCol.jobApplications.splice(targetJobIndex, 0, jobToMove);

  targetCol.jobApplications.forEach((j, idx) => {
    j.order = idx;
  });

  return {
    board: newBoard,
    update: {
      jobId,
      newColumnId: String(targetCol._id),
      order: targetJobIndex,
    },
  };
}
