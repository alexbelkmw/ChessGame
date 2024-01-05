import { Cell, Coordinate } from "../api/types/types";

export const isComplies = (
  cell: Cell,
  target: Coordinate,
  cells: Map<string, Cell>
) => {
  const start: Coordinate = {
    row: cell.coordinate.row,
    column: cell.coordinate.column,
  };
  if (!cell.figure) return false;

  switch (cell.figure.type) {
    case "pawn":
      return pawnMove(start, target, cell.figure.color, cells);
    // case "rook":
    //   return rookMove(start, target);
    // case "knight":
    //   return knightMove(start, target);
    // case "bishop":
    //   return bishopMove(start, target, chessCells);
    // case "king":
    //   return kingMove(start, target);
    // case "queen":
    //   return queenMove(start, target, chessCells);
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
    Math.abs(start.column - target.column) +
      Math.abs(start.row - target.row) ===
    3
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
    noFiguresDiagonally(cells, start, target)
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
  cells: Map<string, Cell>
) => {
  const pathRow = target.row - start.row;
  const pathColumn = target.column - start.column;
  const forward = color === "black" ? -1 : 1;

  if (pathColumn !== 0 || !noFiguresStraight(start, target, cells))
    return false;

  if (
    (start.row === 6 && color === "black") ||
    (start.row === 1 && color === "white")
  ) {
    return pathRow * forward <= 2;
  } else {
    return pathRow * forward === 1;
  }
};

const noFiguresDiagonally = (
  cells: Map<string, Cell>,
  start: Coordinate,
  target: Coordinate
) => {
  return true;
  // const startRow = start.row < target.row ? start.row : target.row;
  // const targetRow = start.row > target.row ? start.row : target.row;
  // const down = start.row < target.row;
  // const right = start.column < target.row;
  // let column = down ? start.column : target.column;
  // let figuteCount = 0;
  // const rows = chessCells.slice(startRow, targetRow + 1);

  // rows.forEach((row) => {
  //   if (row[column].figure) figuteCount++;
  //   if (down === right) column++;
  //   else column--;
  // });

  // return figuteCount === 1;
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

  for (let i = start; i !== target; i = i + direction) {
    const key = oneColumn
      ? `cell-${i}-${constCoord}`
      : `cell-${constCoord}-${i}`;
    if (cells.get(key)?.figure) figureCount++;
  }

  return figureCount <= 1;
};
