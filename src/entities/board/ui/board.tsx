import { useDispatch } from "react-redux";
import { isEven } from "../../../shaped/lib/mathUtils";
import { ARRANGE_THE_PIECES, REARRANGE_THE_PIECES } from "../model/actions";
import { Cell, Coordinate, Figure } from "../model/types";
import { PawnPanel } from "./PanwPanel";
import cls from "./style.module.scss";

const startArrangement: (cell: Coordinate) => Figure | undefined = (cell) => {
  const row = cell.row;
  const column = cell.column;
  const color = cell.row <= 1 ? "white" : "black";
  if (row === 1 || row === 6) return { color, type: "Pawn" };
  if (row === 0 || row === 7) {
    switch (column) {
      case 0:
      case 7:
        return { color, type: "Rook" };
      case 1:
      case 6:
        return { color, type: "Knight" };
      case 2:
      case 5:
        return { color, type: "Bishop" };
      case 3:
        return { color, type: "King" };
      default:
        return { color, type: "Queen" };
    }
  }
  return undefined;
};

interface IBoard {
  figureImages: Record<string, string>;
}

export const Board = ({ figureImages }: IBoard): JSX.Element => {
  const dispatch = useDispatch();
  const cells = new Map<string, Cell>();
  const board: JSX.Element[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = isEven(i) === isEven(j) ? "white" : "DarkOliveGreen";
      const coordinate: Coordinate = { row: i, column: j };
      const figure = startArrangement(coordinate);
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
              src={figureImages[`${figure.color}${figure.type}`]}
            />
          ) : null}
        </div>
      );
    }
  }
  dispatch({ type: ARRANGE_THE_PIECES, payload: { cells } });

  return (
    <div id="board" className={cls.Board}>
      <PawnPanel figureImages={figureImages} />
      {board}
    </div>
  );
};
