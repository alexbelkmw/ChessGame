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
  color: colors;
  startPosition: boolean;
}

export interface Cell {
  coordinate: Coordinate;
  color: string;
  figure?: Figure;
}

export interface KingsCoordinate {
  black: string;
  white: string;
}

export enum colors {
  black = "black",
  white = "white",
}
