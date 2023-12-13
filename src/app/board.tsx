import { isEven } from "../shaped/lib/mathUtils";
import { Cell, Coordinate, Figure } from "./api/types";
import cls from "./app.module.scss";
import bB from "./assets/bB.png";
import bK from "./assets/bK.png";
import bN from "./assets/bN.png";
import bP from "./assets/bP.png";
import bQ from "./assets/bQ.png";
import bR from "./assets/bR.png";
import wB from "./assets/wB.png";
import wK from "./assets/wK.png";
import wN from "./assets/wN.png";
import wP from "./assets/wP.png";
import wQ from "./assets/wQ.png";
import wR from "./assets/wR.png";

const startArrangement: (cell: Coordinate) => Figure | undefined = (cell) => {
  const row = cell.row;
  const column = cell.column;
  const color = cell.row <= 1 ? "white" : "black";
  if (row === 1) return { color, image: wP, type: "pawn" };
  if (row === 6) return { color, image: bP, type: "pawn" };
  if (row === 0 || row === 7) {
    switch (column) {
      case 0:
      case 7:
        return { color, type: "rook", image: color === "white" ? wR : bR };
      case 1:
      case 6:
        return { color, type: "knight", image: color === "white" ? wN : bN };
      case 2:
      case 5:
        return { color, type: "bishop", image: color === "white" ? wB : bB };
      case 3:
        return { color, type: "king", image: color === "white" ? wK : bK };
      default:
        return { color, type: "queen", image: color === "white" ? wQ : bQ };
    }
  }
  return undefined;
};

export const initBoard = (
  cells: Map<Coordinate, Cell>
): [JSX.Element[], Map<Coordinate, Cell>] => {
  const board: JSX.Element[] = [];
  for (let i = 0; i < 8; i++) {
    const row: JSX.Element[] = [];
    for (let j = 0; j < 8; j++) {
      const color = isEven(i) === isEven(j) ? "white" : "DarkOliveGreen";
      const figure = startArrangement({ row: i, column: j });
      cells.set(
        { row: i, column: j },
        {
          coordinate: { row: i, column: j },
          color,
          figure,
        }
      );
      row.push(
        <div
          key={`cell-${i}-${j}`}
          className={cls.Cell + ` none-${i}-${j}`}
          style={{ backgroundColor: color }}
        >
          {figure ? (
            <img
              className={` figure-${color}-${i}-${j}`}
              onDragEnd={(event) => {}}
              src={figure.image}
            />
          ) : null}
        </div>
      );
    }
    board.push(
      <div key={"row-" + i} className={cls.Row}>
        {row}
      </div>
    );
  }

  return [board, cells];
};
