import cls from "./styles/app.module.scss";
import { PlayGround } from "../entities/board/";
import { figureImages } from "../entities/figures";

export const App = () => {
  return (
    <div className={cls.App}>
      <PlayGround figureImages={figureImages} />
    </div>
  );
};
