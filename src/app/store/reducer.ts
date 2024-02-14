import { configureStore } from "@reduxjs/toolkit";
import { isComplies } from "../../entities/board/lib/chessMoving";
import {
  REARRANGE_THE_PIECES,
  ARRANGE_THE_PIECES,
  REPLACE_PAWN,
} from "../../entities/board/model/actions";
import { Cell, FigureTypes } from "../../entities/board/model/types";

export interface GlobalState {
  cells: Map<string, Cell>;
  target: { id: string; figure: string } | null;
  moveColor: string;
  blockMove: boolean;
}
const initState = {
  cells: new Map<string, Cell>(),
  target: null,
  moveColor: "white",
  blockMove: false,
};

const reducer = (
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

export const globalStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const replacePawn: (
  state: GlobalState,
  payload: {
    figure: FigureTypes;
    targetCoordinate: string;
    moveColor: string;
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
    figure: { color: payload.moveColor, type: payload.figure },
  });

  return { ...state, blockMove: false, target: null, cells: newCells };
};

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
  let targetFigure: HTMLElement | null = null;
  const targetIdCell = targetId.replace("figure", "cell");

  if (targetId.split("-")[0] === "figure") {
    targetFigure = document.getElementById(targetId);
  }

  const startElement = document.getElementById(startId);
  const targetElement = document.getElementById(targetIdCell);
  const currentFigure = document.getElementById(figureId);

  if (!startElement || !currentFigure || !targetElement) return state;

  if (!startElement.hasChildNodes()) return state;

  const cells = state.cells;

  const startCell = cells.get(startId);
  const targetCell = cells.get(targetIdCell);

  if (!startCell || !targetCell) return state;

  const figure = startCell.figure;

  if (!figure) return state;

  if (!isComplies(startCell, targetCell, cells, targetElement, targetFigure))
    return state;

  const target = targetId;
  currentFigure.setAttribute("id", targetId.replace("cell", "figure"));
  startElement.removeChild(currentFigure);
  targetElement.appendChild(currentFigure);
  const newCells = new Map(cells);
  newCells.set(startId, { ...startCell, figure: undefined });
  newCells.set(targetIdCell, { ...targetCell, figure: startCell.figure });
  const blockMove =
    figure.type === "Pawn" &&
    (targetCell.coordinate.row === 0 || targetCell.coordinate.row === 7);

  return {
    ...state,
    cells: newCells,
    target: startCell.figure
      ? { figure: startCell.figure.type, id: target }
      : null,
    moveColor: figure.color,
    blockMove,
  };
};
