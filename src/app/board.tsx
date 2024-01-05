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
import { isComplies } from "./lib/chessMoving";

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

const chessArrangement = (
  event: React.DragEvent<HTMLImageElement>,
  setCells: (value: (cells: Map<string, Cell>) => Map<string, Cell>) => void
) => {
  const targetId = document.elementFromPoint(event.clientX, event.clientY)?.id;

  if (!targetId) return;

  const figureId = event.currentTarget.id;
  const startId = figureId.replace("figure", "cell");

  if (targetId.split("-")[0] !== "cell") return;

  const sCell = document.getElementById(startId);
  const tCell = document.getElementById(targetId);
  const figure = document.getElementById(figureId);

  if (!sCell || !figure || !tCell) return;

  setCells((prev) => {
    if (!sCell.hasChildNodes()) return prev;

    figure.setAttribute("id", targetId.replace("cell", "figure"));
    sCell.removeChild(figure);
    tCell.appendChild(figure);

    const startCell = prev.get(startId);
    const targetCell = prev.get(targetId);

    if (!startCell || !targetCell) return prev;

    prev.set(startId, { ...startCell, figure: undefined });
    prev.set(targetId, { ...targetCell, figure: startCell.figure });
    return new Map(prev);
  });
};

export const initBoard = (
  cells: Map<string, Cell>,
  setCells: (value: (cells: Map<string, Cell>) => Map<string, Cell>) => void
): [JSX.Element[], Map<string, Cell>] => {
  const board: JSX.Element[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = isEven(i) === isEven(j) ? "white" : "DarkOliveGreen";
      const coordinate: Coordinate = { row: i, column: j };
      const figure = startArrangement(coordinate);
      const key = `cell-${i}-${j}`;
      cells.set(key, {
        coordinate: coordinate,
        color,
        figure,
      });
      board.push(
        <div
          key={key}
          id={key}
          className={cls.Cell}
          style={{ backgroundColor: color }}
        >
          {figure ? (
            <img
              id={`figure-${i}-${j}`}
              onDragEnd={(event) => {
                chessArrangement(event, setCells);
              }}
              src={figure.image}
            />
          ) : null}
        </div>
      );
    }
  }

  return [board, cells];
};
