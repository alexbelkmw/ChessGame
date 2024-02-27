import cls from "./styles/app.module.scss";
import { Board } from "../entities/board/";
import { figureImages } from "../entities/figures";

export const App = () => {
  return (
    <div className={cls.App}>
      <Board figureImages={figureImages} />
    </div>
  );
};
