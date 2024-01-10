import { Cell, Coordinate } from "../model/types";

interface MoveParams {
  start: Coordinate;
  target: Coordinate;
  color: string;
  cells: Map<string, Cell>;
  targetCell: Cell;
  targetElement: HTMLElement;
  targetFigure: HTMLElement | null;
}

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

  const moveParams = {
    start,
    target,
    color: startCell.figure.color,
    cells,
    targetCell,
    targetElement,
    targetFigure,
  };

  switch (startCell.figure.type) {
    case "pawn":
      return pawnMove(moveParams);
    case "rook":
      return rookMove(moveParams);
    case "knight":
      return knightMove(moveParams);
    case "bishop":
      return bishopMove(moveParams);
    case "king":
      return kingMove(moveParams);
    case "queen":
      return queenMove(moveParams);
    default:
      return false;
  }
};

const queenMove = (move: MoveParams) => {
  return bishopMove(move) || rookMove(move);
};

const kingMove = (move: MoveParams) => {
  const { start, target, color, targetCell, targetElement, targetFigure } =
    move;
  //todo:  под боем или король рядом?
  if (
    Math.abs(start.row - target.row) <= 1 &&
    Math.abs(start.column - target.column) <= 1
  ) {
    if (!targetFigure) return true;
    return eatFigure(targetCell, color, targetElement, targetFigure);
  }
};

const knightMove = (move: MoveParams) => {
  const { start, target, color, targetCell, targetElement, targetFigure } =
    move;
  if (
    (Math.abs(start.column - target.column) === 2 &&
      Math.abs(start.row - target.row) === 1) ||
    (Math.abs(start.column - target.column) === 1 &&
      Math.abs(start.row - target.row) === 2)
  ) {
    if (!targetFigure) return true;
    return eatFigure(targetCell, color, targetElement, targetFigure);
  }
};

const bishopMove = (move: MoveParams) => {
  const {
    start,
    target,
    color,
    cells,
    targetCell,
    targetElement,
    targetFigure,
  } = move;
  const diagonally =
    Math.abs(start.column - target.column) === Math.abs(start.row - target.row);

  if (!diagonally) return false;

  if (noFiguresDiagonally(start, target, cells) === 0) return true;

  if (
    noFiguresDiagonally(start, target, cells) === 1 &&
    eatFigure(targetCell, color, targetElement, targetFigure)
  )
    return true;

  return false;
};

const rookMove = (move: MoveParams) => {
  const {
    start,
    target,
    color,
    cells,
    targetCell,
    targetElement,
    targetFigure,
  } = move;
  const straightLine =
    start.row === target.row || start.column === target.column;

  if (figuresStraight(start, target, cells) === 0) {
    return straightLine;
  } else if (
    figuresStraight(start, target, cells) === 1 &&
    straightLine &&
    eatFigure(targetCell, color, targetElement, targetFigure)
  ) {
    return start.row === target.row || start.column === target.column;
  } else return false;
};

const pawnMove = (move: MoveParams) => {
  const {
    start,
    target,
    color,
    cells,
    targetCell,
    targetElement,
    targetFigure,
  } = move;

  const pathRow = target.row - start.row;
  const pathColumn = target.column - start.column;
  const forward = color === "black" ? -1 : 1;

  if (pathColumn === 0) {
    if (figuresStraight(start, target, cells) !== 0) return false;
    if (
      (start.row === 6 && color === "black") ||
      (start.row === 1 && color === "white")
    ) {
      return pathRow * forward <= 2;
    } else {
      return pathRow * forward === 1;
    }
  } else if (
    Math.abs(pathColumn) === 1 &&
    pathRow * forward === 1 &&
    eatFigure(targetCell, color, targetElement, targetFigure)
  ) {
    return true;
  } else return false;
};

const eatFigure = (
  targetCell: Cell,
  color: string,
  targetElement: HTMLElement,
  targetFigure: HTMLElement | null
) => {
  if (targetCell.figure && targetCell.figure.color !== color && targetFigure) {
    targetElement.removeChild(targetFigure);
    return true;
  }
  return false;
};

const noFiguresDiagonally = (
  sCoord: Coordinate,
  tCoord: Coordinate,
  cells: Map<string, Cell>
) => {
  const downDirection = sCoord.row < tCoord.row ? 1 : -1;
  const rightDirection = sCoord.column < tCoord.column ? 1 : -1;
  let column = sCoord.column + rightDirection;
  let figureCount = 0;
  for (
    let i = sCoord.row + downDirection;
    i !== tCoord.row + downDirection;
    i = i + downDirection
  ) {
    const key = `cell-${i}-${column}`;
    column = column + rightDirection;
    if (cells.get(key)?.figure) figureCount++;
  }
  return figureCount;
};

const figuresStraight = (
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

  for (let i = start + direction; i !== target + direction; i = i + direction) {
    const key = oneColumn
      ? `cell-${i}-${constCoord}`
      : `cell-${constCoord}-${i}`;
    if (cells.get(key)?.figure) figureCount++;
  }

  return figureCount;
};
