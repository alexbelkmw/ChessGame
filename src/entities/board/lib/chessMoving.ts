import { Cell, colors, Coordinate } from "../model/types";

interface MoveParams {
  start: Coordinate;
  target: Coordinate;
  color: string;
  cells: Map<string, Cell>;
  check: boolean;
}

/* Проверка на возможность перемещения */
export const isComplies: (
  startCell: Cell,
  targetCell: Cell,
  cells: Map<string, Cell>,
  check: boolean
) => boolean = (startCell, targetCell, cells, check) => {
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
    check,
  };

  switch (startCell.figure.type) {
    case "Pawn":
      return pawnMove(moveParams);
    case "Rook":
      return rookMove(moveParams);
    case "Knight":
      return knightMove(moveParams);
    case "Bishop":
      return bishopMove(moveParams);
    case "King":
      return kingMove(moveParams);
    case "Queen":
      return queenMove(moveParams);
    default:
      return false;
  }
};

const queenMove = (move: MoveParams) => {
  return bishopMove(move) || rookMove(move);
};

const kingMove = (move: MoveParams) => {
  const { start, target, cells, check } = move;
  const startCell = cells.get(`cell-${start.row}-${start.column}`);
  const targetCell = cells.get(`cell-${target.row}-${target.column}`);

  if (check) return false;

  if (!startCell || !startCell.figure || !targetCell) return false;

  if (
    Math.abs(start.row - target.row) <= 1 &&
    Math.abs(start.column - target.column) <= 1
  ) {
    const checkCells = new Map(cells);
    checkCells.set(`cell-${target.row}-${target.column}`, {
      ...targetCell,
      figure: undefined,
    });
    return (
      checkKing(checkCells, startCell.figure?.color, targetCell) &&
      eatFigure(move)
    );
  } else if (
    Math.abs(start.row - target.row) === 0 &&
    Math.abs(start.column - target.column) === 2
  ) {
    if (!checkKing(cells, startCell.figure?.color, startCell)) return false;
    if (!checkKing(cells, startCell.figure?.color, targetCell)) return false;

    const king = startCell.figure;

    if (!king || !king.startPosition) return false;

    if (!casting(start, target, cells)) return false;

    return true;
  } else {
    return false;
  }
};

/* Рокировка */
const casting: (
  start: Coordinate,
  target: Coordinate,
  cells: Map<string, Cell>
) => boolean = (start, target, cells) => {
  const rookColumn = start.column > target.column ? 0 : 7;
  const middleColumn = start.column > target.column ? -1 : 1;
  const rookCell = cells.get(`cell-${target.row}-${rookColumn}`);
  const startCell = cells.get(`cell-${start.row}-${start.column}`);
  const targetCell = cells.get(`cell-${target.row}-${target.column}`);
  const middleCell = cells.get(
    `cell-${target.row}-${start.column + middleColumn}`
  );
  const kightCell =
    start.column < target.column
      ? cells.get(`cell-${target.row}-${start.column + middleColumn + 1}`)
      : false;

  const color = startCell?.figure?.color;

  const rook = rookCell?.figure;

  if (!rook || !rook.startPosition) return false;
  if (!middleCell || !targetCell || !startCell) return false;
  if (!color) return false;
  if (!checkKing(cells, color, middleCell)) return false;
  if (middleCell.figure || targetCell.figure || (kightCell && kightCell.figure))
    return false;

  return true;
};

const knightMove = (move: MoveParams) => {
  const { start, target } = move;
  if (
    (Math.abs(start.column - target.column) === 2 &&
      Math.abs(start.row - target.row) === 1) ||
    (Math.abs(start.column - target.column) === 1 &&
      Math.abs(start.row - target.row) === 2)
  ) {
    return eatFigure(move);
  } else {
    return false;
  }
};

const bishopMove = (move: MoveParams) => {
  const { start, target, cells } = move;
  const diagonally =
    Math.abs(start.column - target.column) === Math.abs(start.row - target.row);

  if (!diagonally) return false;

  if (noFiguresDiagonally(start, target, cells) === 0) return true;

  if (noFiguresDiagonally(start, target, cells) === 1 && eatFigure(move))
    return true;

  return false;
};

const rookMove = (move: MoveParams) => {
  const { start, target, cells } = move;
  const straightLine =
    start.row === target.row || start.column === target.column;

  if (figuresStraight(start, target, cells) === 0) {
    return straightLine;
  } else if (
    figuresStraight(start, target, cells) === 1 &&
    straightLine &&
    eatFigure(move)
  ) {
    return start.row === target.row || start.column === target.column;
  } else return false;
};

const pawnMove = (move: MoveParams) => {
  const { start, target, color, cells } = move;
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
    eatFigure(move)
  ) {
    return true;
  } else return false;
};

const eatFigure = (move: MoveParams) => {
  const { start, target, color, cells, check } = move;

  const targetCell = cells.get(`cell-${target.row}-${target.column}`);
  const targetFigureElement = document.getElementById(
    `figure-${target.row}-${target.column}`
  );
  const targetCellElement = document.getElementById(
    `cell-${target.row}-${target.column}`
  );

  if (!targetCell) return false;

  if (!targetCell.figure) {
    const startCell = cells.get(`cell-${start.row}-${start.column}`);
    const figure = startCell?.figure;

    if (!figure) return false;

    if (figure.type === "King" || figure.type === "Knight") {
      return true;
    }

    if (figure.type === "Pawn" && check) return true

    return false;
  }

  if (!targetFigureElement || !targetCellElement) return false;

  if (targetCell.figure.color !== color && targetFigureElement) {
    return true;
  }
  return false;
};

/* Наличие фигур по диагональному пути */
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

/* Наличие фигур по прямому пути */
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

/* Проверка под боем ли клетка, куда перемещается или где стоит король */
export const checkKing: (
  cells: Map<string, Cell>,
  movingColor: colors,
  targetCell: Cell
) => boolean = (cells, movingColor, targetCell) => {
  let check = true;

  cells.forEach((cell) => {
    if (!cell.figure) return;

    if (cell.figure.color === movingColor) return;

    if (
      cell.figure.type === "King" &&
      Math.abs(targetCell.coordinate.column - cell.coordinate.column) <= 1 &&
      Math.abs(targetCell.coordinate.row - cell.coordinate.row) <= 1
    ) {
      check = false;
    }

    if (
      cell.figure.type === "Pawn" &&
      cell.coordinate.column === targetCell.coordinate.column
    ) {
      return;
    }

    if (isComplies(cell, targetCell, cells, true)) {
      check = false;
    }
  });

  return check;
};
