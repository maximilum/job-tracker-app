"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Board as BoardI } from "@/lib/models/models.types";
import { computeBoardMove, MoveUpdate } from "@/lib/boardMove";

function cloneAndSortBoard(source: BoardI): BoardI {
  return {
    ...source,
    columns: [...source.columns]
      .sort((a, b) => a.order - b.order)
      .map((col) => ({
        ...col,
        jobApplications: [...col.jobApplications].sort(
          (a, b) => a.order - b.order,
        ),
      })),
  };
}

export function useBoard(boardDoc: BoardI) {
  // Sort initial state without mutating the prop in-place (Fixes Bug 5.1)
  const initialSortedBoard = useMemo(
    () => cloneAndSortBoard(boardDoc),
    [boardDoc],
  );

  const [board, setBoard] = useState<BoardI>(initialSortedBoard);

  // Keep a ref to baseline for cancellation/rollback updated inside effect
  const baselineRef = useRef<BoardI>(initialSortedBoard);
  useEffect(() => {
    baselineRef.current = initialSortedBoard;
  }, [initialSortedBoard]);

  // Functional state updater prevents stale closure races (Fixes Bug 2.6)
  const moveJob = useCallback(
    (
      jobId: string | number,
      targetId: string | number,
    ): MoveUpdate | undefined => {
      let pendingUpdate: MoveUpdate | undefined;

      setBoard((prevBoard) => {
        const result = computeBoardMove(prevBoard, jobId, targetId);
        if (!result) return prevBoard;
        pendingUpdate = result.update;
        return result.board;
      });

      return pendingUpdate;
    },
    [],
  );

  const resetToBaseline = useCallback(() => {
    setBoard(baselineRef.current);
  }, []);

  return { board, moveJob, setBoard, resetToBaseline };
}
