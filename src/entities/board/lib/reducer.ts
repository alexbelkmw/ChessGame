import { checkKing, isComplies } from "./chessMoving";
import {
  REARRANGE_THE_PIECES,
  ARRANGE_THE_PIECES,
  REPLACE_PAWN,
} from "../model/actions";
import { Cell, colors, FigureTypes, KingsCoordinate } from "../model/types";

interface GlobalState {
  cells: Map<string, Cell>;
  target: { id: string; figure: string } | null;
  moveColor: colors;
  blockMove: boolean;
  kingsCoordinate: KingsCoordinate;
}
const initState = {
  cells: new Map<string, Cell>(),
  target: null,
  moveColor: colors.white,
  blockMove: false,
  kingsCoordinate: {
    white: "cell-0-3",
    black: "cell-7-3",
  },
};

export const boardReducer = (
  state: GlobalState = initState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case ARRANGE_THE_PIECES:
      return { ...state, cells: action.payload.cells };
    case REARRANGE_THE_PIECES:
      return chessArrangement(state, action.payload.event);
    case REPLACE_PAWN:
      return replacePawn(state, action.payload);
    default:
      return state;
  }
};

/* Замена пешки у противоположного края доски */
const replacePawn: (
  state: GlobalState,
  payload: {
    figure: FigureTypes;
    targetCoordinate: string;
    moveColor: colors;
    src: string;
  }
) => GlobalState = (state, payload) => {
  const newCells = new Map(state.cells);
  const targetCell = "cell-" + payload.targetCoordinate;
  const currentCell = newCells.get(targetCell);

  if (!currentCell) return state;

  const currentFigure = document.getElementById(
    "figure-" + payload.targetCoordinate
  );
  currentFigure?.setAttribute("src", payload.src);
  newCells.set(targetCell, {
    ...currentCell,
    figure: {
      color: payload.moveColor,
      type: payload.figure,
      startPosition: false,
    },
  });

  const newMoveColor =
    payload.moveColor === colors.white ? colors.black : colors.white;

  return {
    ...state,
    blockMove: false,
    target: null,
    cells: newCells,
    moveColor: newMoveColor,
  };
};

/* Перестановка фигуры при совершении хода */
const chessArrangement: (
  state: GlobalState,
  event: React.DragEvent<HTMLImageElement>
) => GlobalState = (
  state: GlobalState,
  event: React.DragEvent<HTMLImageElement>
) => {
  if (state.blockMove) return state;

  const targetId = document.elementFromPoint(event.clientX, event.clientY)?.id;

  if (!targetId) return state;

  const figureId = event.currentTarget.id;
  const startId = figureId.replace("figure", "cell");
  const targetIdCell = targetId.replace("figure", "cell");

  if (document.getElementById(startId) === document.getElementById(targetIdCell)) return state;

  const cells = state.cells;

  const startCell = cells.get(startId);
  const targetCell = cells.get(targetIdCell);

  if (!startCell || !targetCell) return state;

  const figure = startCell.figure;

  if (figure?.color !== state.moveColor) return state;

  /* Проверка на перемещение фигуры по правилам */
  if (!isComplies(startCell, targetCell, cells, false)) return state;

  /* Новый порядок фигур */
  const newCells = new Map(cells);
  newCells.set(startId, { ...startCell, figure: undefined });
  newCells.set(targetIdCell, {
    ...targetCell,
    figure: { ...figure, startPosition: false },
  });

  /* Блокировка хода, когда доступна замена пешки */
  const blockMove =
    figure.type === "Pawn" &&
    (targetCell.coordinate.row === 0 || targetCell.coordinate.row === 7);

  /* Очередность хода по цвету */
  const moveColor = blockMove
    ? figure.color
    : figure.color === colors.white
    ? colors.black
    : colors.white;

  /* При любом перемещении фигур проверяем шаг королю */
  const kingsCoordinate =
    figure.type === "King"
      ? { ...state.kingsCoordinate, [figure.color]: targetIdCell }
      : state.kingsCoordinate;
  const kingCell = cells.get(kingsCoordinate[figure.color]);
  if (!kingCell) return state;
  if (!checkKing(newCells, figure.color, kingCell)) return state;

  /* До этого момента проверялись различные условия, теперь происходит возврат нового состояния */
  
  if (figure.type === "King" && Math.abs(startCell.coordinate.column - targetCell.coordinate.column) === 2) {
    const rootStart = targetCell.coordinate.column === 1 ? 0 : 7
    const rootOffset = targetCell.coordinate.column === 1 ? 2 : 4
    const rootCell = newCells.get(`cell-${targetCell.coordinate.row}-${rootStart}`)
    if (rootCell) {
      /* Рокировка */
      newCells.set(`cell-${targetCell.coordinate.row}-${rootStart}`, {...rootCell, figure: undefined})
      newCells.set(`cell-${targetCell.coordinate.row}-${rootOffset}`, {...rootCell, figure: rootCell.figure})
    } else return state
  }

  return {
    ...state,
    cells: newCells,
    target: startCell.figure
      ? { figure: startCell.figure.type, id: targetId }
      : null,
    moveColor,
    blockMove,
    kingsCoordinate,
  };
};
