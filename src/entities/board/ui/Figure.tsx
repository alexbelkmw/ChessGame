import { useDispatch, useSelector } from "react-redux";
import { Cell, Figure } from "../model/types";
import { REARRANGE_THE_PIECES } from "../model/actions";
import { useEffect, useState } from "react";

export const FigureImage = (props: {
  row: number;
  column: number;
  figureImages: Record<string, string>;
  figure?: Figure;
}) => {
  const dispatch = useDispatch();
//   const cells: Map<string, Cell> = useSelector((state: any) => state.cells);
//   const [imageSource, setImageSource] = useState<string | undefined>(undefined);

//   useEffect(() => {
//     setImageSource((prev) => {
//       const color = cells.get(`cell-${props.row}-${props.column}`)?.figure
//         ?.color;
//       const type = cells.get(`cell-${props.row}-${props.column}`)?.figure?.type;

//       if (color && type) {
//         if (prev !== props.figureImages[color + type]){
//             return props.figureImages[color + type];
//         }
//       }

      
//       return prev;
//     });
//   }, [cells]);

  if (!props.figure) return null;

  return (
    <img
      id={`figure-${props.row}-${props.column}`}
      onDragEnd={(event) => {
        dispatch({
          type: REARRANGE_THE_PIECES,
          payload: { event },
        });
      }}
      src={props.figureImages[`${props.figure.color}${props.figure.type}`]}
    />
  );
};
