import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import cls from "./app.module.scss";
import { initBoard } from "./board";

export const App = () => {
  const [board, setBoard] = useState<JSX.Element[] | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setBoard(initBoard(dispatch));
  }, []);

  return (
    <div className={cls.App}>
      <div id="board" className={cls.Board}>
        {board}
      </div>
    </div>
  );
};
