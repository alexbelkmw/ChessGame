import { configureStore } from "@reduxjs/toolkit";
import { isComplies } from "../../lib/chessMoving";
import { Cell } from "../types/types";

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

  if (targetId.split("-")[0] !== "cell") return cells;

  const sCell = document.getElementById(startId);
  const tCell = document.getElementById(targetId);
  const figure = document.getElementById(figureId);

  if (!sCell || !figure || !tCell) return cells;

  if (!sCell.hasChildNodes()) return cells;

  const startCell = cells.get(startId);
  const targetCell = cells.get(targetId);

  if (!startCell || !targetCell) return cells;

  if (!isComplies(startCell, targetCell.coordinate, cells)) return cells;

  figure.setAttribute("id", targetId.replace("cell", "figure"));
  sCell.removeChild(figure);
  tCell.appendChild(figure);
  const newCells = new Map(cells);
  newCells.set(startId, { ...startCell, figure: undefined });
  newCells.set(targetId, { ...targetCell, figure: startCell.figure });

  return newCells;
};
