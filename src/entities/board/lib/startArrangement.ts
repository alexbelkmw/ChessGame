import { colors, Coordinate, Figure } from "../model/types";

/* Начальная расстановка фигур */
export const startArrangement: (cell: Coordinate) => Figure | undefined = (
  cell
) => {
  const row = cell.row;
  const column = cell.column;
  const color = cell.row <= 1 ? colors.white : colors.black;
  const startPosition = true;
  if (row === 1 || row === 6) return { color, type: "Pawn", startPosition };
  if (row === 0 || row === 7) {
    switch (column) {
      case 0:
      case 7:
        return { color, type: "Rook", startPosition };
      case 1:
      case 6:
        return { color, type: "Knight", startPosition };
      case 2:
      case 5:
        return { color, type: "Bishop", startPosition };
      case 3:
        return { color, type: "King", startPosition };
      default:
        return { color, type: "Queen", startPosition };
    }
  }
  return undefined;
};
