import { Dispatch } from "@reduxjs/toolkit";
import { isEven } from "../../../shaped/lib/mathUtils";
import { ARRANGE_THE_PIECES, REARRANGE_THE_PIECES } from "../model/actions";
import { Cell, Coordinate, Figure } from "../model/types";
import cls from "./style.module.scss";

const startArrangement: (
  cell: Coordinate,
  figureImages: any
) => Figure | undefined = (cell, figureImages) => {
  const { bB, bK, bN, bP, bQ, bR, wB, wK, wN, wP, wQ, wR } = figureImages;
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
  dispatch: Dispatch,
  figureImages: any
): JSX.Element[] => {
  const cells = new Map<string, Cell>();
  const board: JSX.Element[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = isEven(i) === isEven(j) ? "white" : "DarkOliveGreen";
      const coordinate: Coordinate = { row: i, column: j };
      const figure = startArrangement(coordinate, figureImages);
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
                dispatch({
                  type: REARRANGE_THE_PIECES,
                  payload: { event },
                });
              }}
              src={figure.image}
            />
          ) : null}
        </div>
      );
    }
  }
  dispatch({ type: ARRANGE_THE_PIECES, payload: { cells } });

  return board;
};
