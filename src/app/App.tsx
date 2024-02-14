import cls from "./styles/app.module.scss";
import { Board } from "../entities/board/ui/board";
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
  const figureImages = {
    blackBishop: bB,
    blackKing: bK,
    blackKnight: bN,
    blackPawn: bP,
    blackQueen: bQ,
    blackRook: bR,
    whiteBishop: wB,
    whiteKing: wK,
    whiteKnight: wN,
    whitePawn: wP,
    whiteQueen: wQ,
    whiteRook: wR,
  };

  return (
    <div className={cls.App}>
      <Board figureImages={figureImages} />
    </div>
  );
};
