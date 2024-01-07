import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import cls from "./styles/app.module.scss";
import { initBoard } from "../entities/board/ui/board";
import bB from "./assets/bB.png";
import bK from "./assets/bK.png";
import bN from "./assets/bN.png";
import bP from "./assets/bP.png";
import bQ from "./assets/bQ.png";
import bR from "./assets/bR.png";
import wB from "./assets/wB.png";
import wK from "./assets/wK.png";
import wN from "./assets/wN.png";
import wP from "./assets/wP.png";
import wQ from "./assets/wQ.png";
import wR from "./assets/wR.png";

export const App = () => {
  const figureImages = { bB, bK, bN, bP, bQ, bR, wB, wK, wN, wP, wQ, wR };
  const [board, setBoard] = useState<JSX.Element[] | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setBoard(initBoard(dispatch, figureImages));
  }, []);

  return (
    <div className={cls.App}>
      <div id="board" className={cls.Board}>
        {board}
      </div>
    </div>
  );
};
