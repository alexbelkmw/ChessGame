import { Cell, Coordinate } from "../model/types";

export const isComplies = (
  startCell: Cell,
  targetCell: Cell,
  cells: Map<string, Cell>,
  targetElement: HTMLElement,
  targetFigure: HTMLElement | null
) => {
  const start: Coordinate = {
    row: startCell.coordinate.row,
    column: startCell.coordinate.column,
  };
  const target: Coordinate = {
    row: targetCell.coordinate.row,
    column: targetCell.coordinate.column,
  };
  if (!startCell.figure) return false;

  switch (startCell.figure.type) {
    case "pawn":
      return pawnMove(
        start,
        target,
        startCell.figure.color,
        cells,
        targetCell,
        targetElement,
        targetFigure
      );
    case "rook":
      return rookMove(start, target, cells);
    case "knight":
      return knightMove(start, target);
    case "bishop":
      return bishopMove(start, target, cells);
    case "king":
      return kingMove(start, target);
    case "queen":
      return queenMove(start, target, cells);
    default:
      return false;
  }
};

const queenMove = (
  start: Coordinate,
  target: Coordinate,
  cells: Map<string, Cell>
) => {
  return bishopMove(start, target, cells) || rookMove(start, target, cells);
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
    (Math.abs(start.column - target.column) === 2 &&
      Math.abs(start.row - target.row) === 1) ||
    (Math.abs(start.column - target.column) === 1 &&
      Math.abs(start.row - target.row) === 2)
  );
};
const bishopMove = (
  start: Coordinate,
  target: Coordinate,
  cells: Map<string, Cell>
) => {
  return (
    Math.abs(start.column - target.column) ===
      Math.abs(start.row - target.row) &&
    noFiguresDiagonally(start, target, cells)
  );
};

const rookMove = (
  start: Coordinate,
  target: Coordinate,
  cells: Map<string, Cell>
) => {
  return (
    (start.row === target.row || start.column === target.column) &&
    noFiguresStraight(start, target, cells)
  );
};

const pawnMove = (
  start: Coordinate,
  target: Coordinate,
  color: string,
  cells: Map<string, Cell>,
  enemy: Cell,
  targetElement: HTMLElement,
  targetFigure: HTMLElement | null
) => {
  const pathRow = target.row - start.row;
  const pathColumn = target.column - start.column;
  const forward = color === "black" ? -1 : 1;

  if (pathColumn === 0) {
    if (!noFiguresStraight(start, target, cells)) return false;
    if (
      (start.row === 6 && color === "black") ||
      (start.row === 1 && color === "white")
    ) {
      return pathRow * forward <= 2;
    } else {
      return pathRow * forward === 1;
    }
  } else if (
    enemy.figure &&
    enemy.figure.color !== color &&
    Math.abs(pathColumn) === 1 &&
    pathRow * forward === 1 &&
    targetFigure
  ) {
    targetElement.removeChild(targetFigure);

    return true;
  } else return false;
};

const noFiguresDiagonally = (
  sCoord: Coordinate,
  tCoord: Coordinate,
  cells: Map<string, Cell>
) => {
  const downDirection = sCoord.row < tCoord.row ? 1 : -1;
  const rightDirection = sCoord.column < tCoord.column ? 1 : -1;
  let column = sCoord.column;
  let figureCount = 0;
  for (let i = sCoord.row; i !== tCoord.row; i = i + downDirection) {
    const key = `cell-${i}-${column}`;
    column = column + rightDirection;
    if (cells.get(key)?.figure) figureCount++;
  }
  return figureCount <= 1;
};

const noFiguresStraight = (
  sCoord: Coordinate,
  tCoord: Coordinate,
  cells: Map<string, Cell>
) => {
  const oneColumn = sCoord.column === tCoord.column;
  const start = oneColumn ? sCoord.row : sCoord.column;
  const target = oneColumn ? tCoord.row : tCoord.column;
  const constCoord = oneColumn ? sCoord.column : sCoord.row;
  const direction = start < target ? 1 : -1;
  let figureCount = 0;

  for (let i = start; i !== target + direction; i = i + direction) {
    const key = oneColumn
      ? `cell-${i}-${constCoord}`
      : `cell-${constCoord}-${i}`;
    if (cells.get(key)?.figure) figureCount++;
  }

  return figureCount <= 1;
};
