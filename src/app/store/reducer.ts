import { configureStore } from "@reduxjs/toolkit";
import { isComplies } from "../../entities/board/lib/chessMoving";
import { Cell } from "../../entities/board/model/types";

export interface GlobalState {
  cells: Map<string, Cell>;
}
const initState = {
  cells: new Map<string, Cell>(),
};

const reducer = (
  state: GlobalState = initState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "ARRANGE_THE_PIECES":
      return { ...state, cells: action.payload.cells };
    case "REARRANGE_THE_PIECES":
      return {
        ...state,
        cells: chessArrangement(state.cells, action.payload.event),
      };
    default:
      return state;
  }
};

export const globalStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const chessArrangement = (
  cells: Map<string, Cell>,
  event: React.DragEvent<HTMLImageElement>
) => {
  const targetId = document.elementFromPoint(event.clientX, event.clientY)?.id;

  if (!targetId) return cells;

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

  if (!startElement || !currentFigure || !targetElement) return cells;

  if (!startElement.hasChildNodes()) return cells;

  const startCell = cells.get(startId);
  const targetCell = cells.get(targetIdCell);

  if (!startCell || !targetCell) return cells;

  if (!isComplies(startCell, targetCell, cells, targetElement, targetFigure))
    return cells;

  currentFigure.setAttribute("id", targetId.replace("cell", "figure"));
  startElement.removeChild(currentFigure);
  targetElement.appendChild(currentFigure);
  const newCells = new Map(cells);
  newCells.set(startId, { ...startCell, figure: undefined });
  newCells.set(targetIdCell, { ...targetCell, figure: startCell.figure });

  return newCells;
};
