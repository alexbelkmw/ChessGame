import { useEffect, useState } from "react";
import { Cell, Coordinate } from "./api/types";
import cls from "./app.module.scss";
import { initBoard } from "./board";

export const App = () => {
  const [cells, setCells] = useState(new Map<string, Cell>());
  const [board, setBoard] = useState<JSX.Element[] | null>(null);

  useEffect(() => {
    const [newBoard, newCells] = initBoard(cells, setCells);
    setBoard(newBoard);
    setCells(newCells);
  }, []);

  return (
    <div className={cls.App}>
      <div id="board" className={cls.Board}>
        {board}
      </div>
    </div>
  );
};
