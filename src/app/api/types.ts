export interface Coordinate {
  row: number;
  column: number;
}

export interface Figure {
  type: "pawn" | "rook" | "knight" | "bishop" | "king" | "queen";
  color: string;
  image: string;
}

export interface Cell {
  coordinate: Coordinate;
  color: string;
  figure?: Figure;
}
