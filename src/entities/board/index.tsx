import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEven } from "../../shaped/lib/mathUtils";
import { startArrangement } from "./lib/startArrangement";
import { ARRANGE_THE_PIECES } from "./model/actions";
import { Cell, Coordinate } from "./model/types";
import { PawnPanel } from "./ui/PanwPanel";
import cls from "./ui/style.module.scss";
import { FigureImage } from "./ui/Figure";

interface IBoard {
  figureImages: Record<string, string>;
}

export const Board = ({ figureImages }: IBoard): JSX.Element => {
  const dispatch = useDispatch();
  const [board, setBoard] = useState<JSX.Element[]>([]);
  const cells: Map<string, Cell> = useSelector((state: any) => state.cells)


  /* Построение шахматной доски при первичном рендере.
  Набор клеток не зависит от состояния фигур.
  Поэтому при изменении состояния фигур, доска обновляется отдельно.
  Таким образом каждый ход меняется 2 клетки, а не обновляется 64. */
  useEffect(() => {
    const newBoard = [];
    const cells = new Map<string, Cell>();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        /* Белый цвет, если столбец и строка четные */
        const color = isEven(i) === isEven(j) ? "white" : "DarkOliveGreen";
        const coordinate: Coordinate = { row: i, column: j };
        /* по координатам получает нужную фигуру или пустое место */
        const figure = startArrangement(coordinate);
        const key = `cell-${i}-${j}`;
        cells.set(key, {
          coordinate: coordinate,
          figure,
        });
        newBoard.push(
          <div
            key={key}
            id={key}
            className={cls.Cell}
            style={{ backgroundColor: color }}
          >
            <FigureImage
              row={i}
              column={j}
              figureImages={figureImages}
              figure={figure}
            />
          </div>
        );
      }
    }
    /* Отправляем в рендер клетки, а состояние клетов сохраняем в стор */
    setBoard(newBoard);
    dispatch({ type: ARRANGE_THE_PIECES, payload: { cells } });
  }, []);

  return (
    <div id="board" className={cls.Board}>
      <PawnPanel figureImages={figureImages} />
      {board}
    </div>
  );
};
