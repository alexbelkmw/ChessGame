import { useDispatch, useSelector } from "react-redux";
import { Cell, Figure } from "../model/types";
import { REARRANGE_THE_PIECES } from "../model/actions";
import { memo, useEffect, useState } from "react";
import cls from "./style.module.scss";
import { isEven } from "../../../shared/lib/mathUtils";

export const CellImage = memo(
  (props: {
    figureImages: Record<string, string>;
    cell?: Cell;
  }) => {
    const { cell, figureImages } = props

    if (!cell) return null

    const dispatch = useDispatch();
    const cellColor = isEven(cell.coordinate.row) === isEven(cell.coordinate.column) ? "white" : "DarkOliveGreen";
    const color = cell.figure?.color;
    const type = cell.figure?.type;
    const figureName = color && type ? color + type : "";

    return (
      <div
        id={`cell-${cell.coordinate.row}-${cell.coordinate.column}`}
        className={cls.Cell}
        style={{ backgroundColor: cellColor }}
      >
        {cell.figure ? (
          <img
            id={`figure-${cell.coordinate.row}-${cell.coordinate.column}`}
            onDragEnd={(event) => {
              
              dispatch({
                type: REARRANGE_THE_PIECES,
                payload: { event },
              });
            }}
            src={figureImages[`${figureName}`]}
          />
        ) : null}
      </div>
    );
  }
);
