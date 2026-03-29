import { Board, Column } from "./models";
import connectDB from "./db";

export default async function initUserBoard(userId: string) {
  try {
    // Connect to the database
    await connectDB();
    //   check if user has a board
    const existingBoard = await Board.findOne({ userId });

    //   if it already exist, return
    if (existingBoard) return existingBoard;

    // create a board using user id
    const newBoard = new Board({
      name: "New Board",
      userId: userId,
      columns: [],
    });
    await newBoard.save();

    // create a columns
    // create default columns
    const DEFAULT_COLUMNS = [
      {
        name: "Wish List",
        order: 0,
      },
      { name: "Applied", order: 1 },
      { name: "Interviewing", order: 2 },
      { name: "Offer", order: 3 },
      { name: "Rejected", order: 4 },
    ];

    // map default columns to column documents
    const columns = await Promise.all(
      DEFAULT_COLUMNS.map((column) => {
        return Column.create({
          name: column.name,
          order: column.order,
          boardId: newBoard._id,
          userId,
          jobApplications: [],
        });
      }),
    );

    //   save the columns to the board
    newBoard.columns = columns.map((column) => column._id);
    await newBoard.save();

    return newBoard;
  } catch (error) {
    console.log(error);
  }
}
