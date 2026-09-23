import { describe, it, expect } from "vitest";
import { computeBoardMove } from "@/lib/boardMove";
import { Board } from "@/lib/models/models.types";

function createMockBoard(): Board {
  return {
    _id: "board-1",
    name: "Test Board",
    columns: [
      {
        _id: "col-1",
        name: "Wish List",
        boardId: "board-1",
        order: 0,
        userId: "user-1",
        jobApplications: [
          {
            _id: "job-1",
            company: "Company A",
            position: "Dev",
            status: "applied",
            columnId: "col-1",
            boardId: "board-1",
            userId: "user-1",
            order: 0,
          },
          {
            _id: "job-2",
            company: "Company B",
            position: "Dev",
            status: "applied",
            columnId: "col-1",
            boardId: "board-1",
            userId: "user-1",
            order: 1,
          },
          {
            _id: "job-3",
            company: "Company C",
            position: "Dev",
            status: "applied",
            columnId: "col-1",
            boardId: "board-1",
            userId: "user-1",
            order: 2,
          },
        ],
      },
      {
        _id: "col-2",
        name: "Applied",
        boardId: "board-1",
        order: 1,
        userId: "user-1",
        jobApplications: [
          {
            _id: "job-4",
            company: "Company D",
            position: "Dev",
            status: "applied",
            columnId: "col-2",
            boardId: "board-1",
            userId: "user-1",
            order: 0,
          },
        ],
      },
      {
        _id: "col-3",
        name: "Empty Column",
        boardId: "board-1",
        order: 2,
        userId: "user-1",
        jobApplications: [],
      },
    ],
  };
}

describe("computeBoardMove pure function", () => {
  it("handles same-column move down without off-by-one error (Bug 2.7)", () => {
    const board = createMockBoard();
    // Move job-1 (order 0) down to job-3 (order 2)
    const result = computeBoardMove(board, "job-1", "job-3");
    expect(result).not.toBeNull();

    const col1 = result!.board.columns.find((c) => c._id === "col-1")!;
    const ids = col1.jobApplications.map((j) => j._id);
    expect(ids).toEqual(["job-2", "job-3", "job-1"]);

    expect(col1.jobApplications[0].order).toBe(0);
    expect(col1.jobApplications[1].order).toBe(1);
    expect(col1.jobApplications[2].order).toBe(2);

    expect(result!.update).toEqual({
      jobId: "job-1",
      newColumnId: "col-1",
      order: 2,
    });
  });

  it("handles same-column move up", () => {
    const board = createMockBoard();
    // Move job-3 (order 2) up to job-1 (order 0)
    const result = computeBoardMove(board, "job-3", "job-1");
    expect(result).not.toBeNull();

    const col1 = result!.board.columns.find((c) => c._id === "col-1")!;
    const ids = col1.jobApplications.map((j) => j._id);
    expect(ids).toEqual(["job-3", "job-1", "job-2"]);

    expect(result!.update).toEqual({
      jobId: "job-3",
      newColumnId: "col-1",
      order: 0,
    });
  });

  it("handles cross-column move onto an existing card", () => {
    const board = createMockBoard();
    // Move job-1 from col-1 to col-2 before job-4
    const result = computeBoardMove(board, "job-1", "job-4");
    expect(result).not.toBeNull();

    const col1 = result!.board.columns.find((c) => c._id === "col-1")!;
    const col2 = result!.board.columns.find((c) => c._id === "col-2")!;

    expect(col1.jobApplications.map((j) => j._id)).toEqual(["job-2", "job-3"]);
    expect(col2.jobApplications.map((j) => j._id)).toEqual(["job-1", "job-4"]);
    expect(col2.jobApplications[0].columnId).toBe("col-2");

    expect(result!.update).toEqual({
      jobId: "job-1",
      newColumnId: "col-2",
      order: 0,
    });
  });

  it("handles drop onto an empty column", () => {
    const board = createMockBoard();
    // Move job-1 from col-1 to col-3 (empty)
    const result = computeBoardMove(board, "job-1", "col-3");
    expect(result).not.toBeNull();

    const col1 = result!.board.columns.find((c) => c._id === "col-1")!;
    const col3 = result!.board.columns.find((c) => c._id === "col-3")!;

    expect(col1.jobApplications.map((j) => j._id)).toEqual(["job-2", "job-3"]);
    expect(col3.jobApplications.map((j) => j._id)).toEqual(["job-1"]);
    expect(col3.jobApplications[0].columnId).toBe("col-3");
    expect(col3.jobApplications[0].order).toBe(0);

    expect(result!.update).toEqual({
      jobId: "job-1",
      newColumnId: "col-3",
      order: 0,
    });
  });

  it("returns null for no-op drops (dropping on self)", () => {
    const board = createMockBoard();
    const result = computeBoardMove(board, "job-1", "job-1");
    expect(result).toBeNull();
  });
});
