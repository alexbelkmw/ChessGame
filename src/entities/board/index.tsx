import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isEven } from "../../shared/lib/mathUtils";
import { startArrangement } from "./lib/startArrangement";
import { ARRANGE_THE_PIECES } from "./model/actions";
import { Cell, Coordinate } from "./model/types";
import { PawnPanel } from "./ui/PanwPanel";
import cls from "./ui/style.module.scss";
import { Board } from "./ui/Board";

interface IBoard {
  figureImages: Record<string, string>;
}

export const PlayGround = ({ figureImages }: IBoard): JSX.Element => {
  const dispatch = useDispatch();

  /* Построение шахматной доски при первичном рендере.
  Набор клеток не зависит от состояния фигур.
  Поэтому при изменении состояния фигур, доска обновляется отдельно.
  Таким образом каждый ход меняется 2 клетки, а не обновляется 64. */
  useEffect(() => {
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
      }
    }
    /* Отправляем в рендер клетки, а состояние клетов сохраняем в стор */
    dispatch({ type: ARRANGE_THE_PIECES, payload: { cells } });
  }, []);

  return (
    <div id="board" className={cls.Board}>
      <PawnPanel figureImages={figureImages} />
      <Board />
    </div>
  );
};
