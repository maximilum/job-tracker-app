import { Board, Column } from "./models";
import connectDB from "./db";

export default async function initUserBoard(userId: string) {
  // Connect to the database
  await connectDB();

  // Check if user has a board
  const existingBoard = await Board.findOne({ userId });
  if (existingBoard) return existingBoard;

  // Create a board for the user
  const newBoard = new Board({
    name: "New Board",
    userId,
    columns: [],
  });
  await newBoard.save();

  // Default columns for a new board
  const DEFAULT_COLUMNS = [
    { name: "Wish List", order: 0 },
    { name: "Applied", order: 1 },
    { name: "Interviewing", order: 2 },
    { name: "Offer", order: 3 },
    { name: "Rejected", order: 4 },
  ];

  // Map default columns to column documents
  const columns = await Promise.all(
    DEFAULT_COLUMNS.map((column) => {
      return Column.create({
        name: column.name,
        order: column.order,
        boardId: newBoard._id,
        userId,
      });
    }),
  );

  // Save the columns to the board
  newBoard.columns = columns.map((column) => column._id);
  await newBoard.save();

  return newBoard;
}
