import { DragEventHandler, useEffect, useState } from "react";
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
import {
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "./lib/chessMoving";

export const App = () => {
  const [chessCells, setChessCells] = useState<Cell[][]>([]);
  const isEven = (n: number) => {
    return n % 2 === 0;
  };
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
  useEffect(() => {
    for (let i = 0; i < 8; i++) {
      const chessRow: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        chessRow.push({
          coordinate: { row: i, column: j },
          color: isEven(i) === isEven(j) ? "white" : "DarkOliveGreen",
          figure: startArrangement({ row: i, column: j }),
        });
      }
      setChessCells((prev) => [...prev, chessRow]);
    }
  }, []);
  const isComplies = (cell: Cell, target: Coordinate) => {
    const start: Coordinate = {
      row: cell.coordinate.row,
      column: cell.coordinate.column,
    };
    if (!cell.figure) return false;

    switch (cell.figure.type) {
      case "pawn":
        return pawnMove(start, target, cell.figure.color);
      case "rook":
        return rookMove(start, target, chessCells);
      case "knight":
        return knightMove(start, target);
      case "bishop":
        return bishopMove(start, target, chessCells);
      case "king":
        return kingMove(start, target);
      case "queen":
        return queenMove(start, target, chessCells);
      default:
        return false;
    }
  };

  const chessArrangement = (
    event: React.DragEvent<HTMLImageElement>,
    dragCell: Cell
  ) => {
    const className = document.elementFromPoint(
      event.clientX,
      event.clientY
    )?.className;

    if (!className) return;

    const cellInfo = className.split(" ")[1];

    if (!cellInfo) return;

    const [figure, rowName, cellName] = cellInfo.split("-");

    if (figure !== "none") return;

    const targetRow = rowName ? Number(rowName) : undefined;
    const targetColumn = cellName ? Number(cellName) : undefined;

    const startRow = dragCell.coordinate.row;
    const startColumn = dragCell.coordinate.column;

    if (targetRow === undefined || targetColumn === undefined) return;

    setChessCells((prev) => {
      if (!isComplies(dragCell, { row: targetRow, column: targetColumn })) {
        return prev;
      }
      return prev.map((row, i) => {
        return row.map((cell, j) => {
          if (i === startRow && j === startColumn) {
            return { ...cell, figure: undefined };
          } else if (i === targetRow && j === targetColumn) {
            return { ...cell, figure: dragCell.figure };
          } else {
            return cell;
          }
        });
      });
    });
  };

  return (
    <div className={cls.App}>
      <div id="board" className={cls.Board}>
        {chessCells.map((row, i) => {
          return (
            <div key={"row-" + i} className={cls.Row}>
              {row.map((cell, j) => {
                return (
                  <div
                    key={`cell-${i}-${j}`}
                    className={cls.Cell + ` none-${i}-${j}`}
                    style={{ backgroundColor: cell.color }}
                  >
                    {cell.figure ? (
                      <img
                        className={` figure-${cell.color}-${i}-${j}`}
                        onDragEnd={(event) => chessArrangement(event, cell)}
                        src={cell.figure.image}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
