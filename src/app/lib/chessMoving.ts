import { Cell, Coordinate } from "../api/types";

export const isComplies = (
  cell: Cell,
  target: Coordinate,
  chessCells: Cell[][]
) => {
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

const queenMove = (
  start: Coordinate,
  target: Coordinate,
  chessCells: Cell[][]
) => {
  return (
    bishopMove(start, target, chessCells) || rookMove(start, target, chessCells)
  );
};
const kingMove = (start: Coordinate, target: Coordinate) => {
  //todo:  под боем или король рядом?
  return (
    Math.abs(start.row - target.row) <= 1 &&
    Math.abs(start.column - target.column) <= 1
  );
};
const knightMove = (start: Coordinate, target: Coordinate) => {
  return (
    Math.abs(start.column - target.column) +
      Math.abs(start.row - target.row) ===
    3
  );
};
const bishopMove = (
  start: Coordinate,
  target: Coordinate,
  chessCells: Cell[][]
) => {
  return (
    Math.abs(start.column - target.column) ===
      Math.abs(start.row - target.row) &&
    noFiguresDiagonally(chessCells, start, target)
  );
};

const rookMove = (
  start: Coordinate,
  target: Coordinate,
  chessCells: Cell[][]
) => {
  return (
    (start.row === target.row || start.column === target.column) &&
    noFiguresStraight(start, target, chessCells)
  );
};

const pawnMove = (start: Coordinate, target: Coordinate, color: string) => {
  const pathRow = target.row - start.row;
  const pathColumn = target.column - start.column;

  const forward = color === "black" ? -1 : 1;

  if (start.row === 6 || start.row === 1) {
    return pathRow * forward <= 2 && pathColumn === 0;
  } else {
    return pathRow * forward === 1 && pathColumn === 0;
  }
};

const noFiguresDiagonally = (
  chessCells: Cell[][],
  start: Coordinate,
  target: Coordinate
) => {
  const startRow = start.row < target.row ? start.row : target.row;
  const targetRow = start.row > target.row ? start.row : target.row;
  const down = start.row < target.row;
  const right = start.column < target.row;
  let column = down ? start.column : target.column;
  let figuteCount = 0;
  const rows = chessCells.slice(startRow, targetRow + 1);

  rows.forEach((row) => {
    if (row[column].figure) figuteCount++;
    if (down === right) column++;
    else column--;
  });

  return figuteCount === 1;
};
const noFiguresStraight = (
  start: Coordinate,
  target: Coordinate,
  chessCells: Cell[][]
) => {
  const oneRow = start.row === target.row;
  const oneColumn = start.column === target.column;

  if (!oneRow && !oneColumn) return false;

  const startPoint = oneRow ? start.column : start.row;
  const targetPoint = oneRow ? target.column : target.row;
  const begin = startPoint < targetPoint ? startPoint + 1 : targetPoint + 1;
  const length = Math.abs(startPoint - targetPoint) - 1;

  if (oneRow) {
    const startIndex = chessCells[start.row].findIndex(
      (cell) => cell.coordinate.column === begin
    );
    const endIndex = chessCells[start.row].findIndex(
      (cell) => cell.coordinate.column === begin + length
    );
    const cells = chessCells[start.row].slice(startIndex, endIndex);

    return !cells.some((cell) => cell.figure);
  }

  if (oneColumn) {
    const rows = chessCells.slice(begin, begin + length);

    return !rows.some((row) => row[start.column].figure);
  }
};
