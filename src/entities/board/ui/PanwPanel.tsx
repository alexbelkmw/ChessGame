import { useDispatch, useSelector } from "react-redux";
import { REPLACE_PAWN } from "../model/actions";
import cls from "./style.module.scss";

interface IPanel {
  figureImages: Record<string, string>;
}
const CELL_SIZE = 650 * 0.125;

export const PawnPanel = ({ figureImages }: IPanel) => {
  const dispatch = useDispatch();
  const replFigures = ["Queen", "Bishop", "Knight", "Rook"];

  const { target, moveColor } = useSelector((state: any) => state);

  const parsId = (id: string | null) => {
    if (!id) return { tRow: undefined, tColumn: undefined };
    const params = id.split("-");
    return { tRow: params[1], tColumn: params[2] };
  };

  if (!target) return null;

  const targetId = target.id;

  if (target.figure !== "Pawn") return null;

  const { tRow, tColumn } = parsId(targetId);

  if (!tRow || !tColumn) return null;

  if (tRow !== "0" && tRow !== "7") return null;

  const columnOffset = Number(tColumn);
  const left = CELL_SIZE * 1.5 * -1 + CELL_SIZE * columnOffset;
  const top = tRow === "0" ? (CELL_SIZE + 12) * -1 : CELL_SIZE * 8 + 12;

  return (
    <div className={cls.pawnPanel} style={{ left, top }}>
      {replFigures.map((figure) => (
        <img
          key={figure}
          id={figure}
          src={figureImages[`${moveColor}${figure}`]}
          style={{ cursor: "pointer" }}
          onClick={() => {
            dispatch({
              type: REPLACE_PAWN,
              payload: {
                figure,
                targetCoordinate: tRow + "-" + tColumn,
                moveColor,
                src: figureImages[`${moveColor}${figure}`],
              },
            });
          }}
        />
      ))}
    </div>
  );
};
