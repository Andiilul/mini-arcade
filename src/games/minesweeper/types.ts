export interface Cell {
	row: number;
	col: number;
	isMine: boolean;
	isRevealed: boolean;
	isFlagged: boolean;
	number: number | null;
}

export interface Board {
	cells: Cell[][];
	rows: number;
	cols: number;
	mines: number;
}
export interface GameState {
	board: Board;
	gameOver: boolean;
	gameWon: boolean;
	flagsLeft: number;
}
