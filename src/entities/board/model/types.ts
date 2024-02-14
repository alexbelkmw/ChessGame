export interface Coordinate {
  row: number;
  column: number;
}

export type FigureTypes =
  | "Pawn"
  | "Rook"
  | "Knight"
  | "Bishop"
  | "King"
  | "Queen";

export interface Figure {
  type: FigureTypes;
  color: string;
}

export interface Cell {
  coordinate: Coordinate;
  color: string;
  figure?: Figure;
}
