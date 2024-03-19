import { useSelector } from "react-redux";
import { Cell } from "../model/types";
import { useEffect, useState } from "react";
import { CellImage } from "./Cell";
import { figureImages } from "../../../shared/assets/figures";

export const Board = () => {
  const cells: Map<string, Cell> = useSelector((state: any) => state.cells);
  const [cellsArray, setCellsArray] = useState<{ name: string; value: Cell }[]>(
    []
  );

  useEffect(() => {
    const array = Array.from(cells, ([name, value]) => ({ name, value }));
    setCellsArray(array);
  }, [cells]);

  if (cells.size === 0) return null;

  return (
    <>
      {cellsArray.map((cell) => {
        return (
          <CellImage
            figureImages={figureImages}
            cell={cell.value}
            key={cell.name}
          />
        );
      })}
    </>
  );
};
