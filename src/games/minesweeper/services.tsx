import { Cell } from "./types"; // adjust the path if needed

// Create empty cells
export const createEmptyCells = (rows: number, cols: number): Cell[] => {
	const newCells: Cell[] = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			newCells.push({
				row,
				col,
				isMine: false,
				isRevealed: false,
				isFlagged: false,
				number: null,
			});
		}
	}
	return newCells;
};
interface HandleClickParams {
	cells: Cell[];
	rows: number;
	cols: number;
	mines: number;
	isStarted: boolean;
	clickedRow: number;
	clickedCol: number;
}

export const handleCellClick = ({
	cells,
	rows,
	cols,
	mines,
	isStarted,
	clickedRow,
	clickedCol,
}: HandleClickParams): { newCells: Cell[]; newIsStarted: boolean } => {
	const revealZerosRecursive = (
		cells: Cell[],
		row: number,
		col: number,
		visited: Set<string>
	): Cell[] => {
		const key = `${row},${col}`;
		if (row < 0 || row >= rows || col < 0 || col >= cols) return cells;
		if (visited.has(key)) return cells;

		visited.add(key);

		const index = cells.findIndex((c) => c.row === row && c.col === col);
		if (index === -1) return cells;

		const cell = cells[index];

		// Jangan reveal cell yang flagged, langsung return cells tanpa ubah apa-apa
		if (cell.isFlagged) return cells;

		// Jika sudah revealed, return cells supaya gak rekursif terus
		if (cell.isRevealed) return cells;

		let newCells = [...cells];
		newCells[index] = { ...cell, isRevealed: true };

		// Jika ini mine, reveal cuma ini, stop rekursif
		if (cell.isMine) return newCells;

		// Jika nomor 0, reveal semua tetangga (kecuali flagged)
		if (cell.number === 0) {
			for (let r = row - 1; r <= row + 1; r++) {
				for (let c = col - 1; c <= col + 1; c++) {
					if (r === row && c === col) continue;
					newCells = revealZerosRecursive(newCells, r, c, visited);
				}
			}
		}

		return newCells;
	};

	// First click: generate mines and start the game
	if (!isStarted) {
		let newCells = createEmptyCells(rows, cols);
		newCells = placeMines(newCells, rows, cols, mines, clickedRow, clickedCol);

		newCells = revealZerosRecursive(
			newCells,
			clickedRow,
			clickedCol,
			new Set()
		);

		return {
			newCells,
			newIsStarted: true,
		};
	}

	// Game already started: just reveal
	const newCells = revealZerosRecursive(
		cells,
		clickedRow,
		clickedCol,
		new Set()
	);

	return {
		newCells,
		newIsStarted: isStarted,
	};
};

const getNeighbors = (row: number, col: number, rows: number, cols: number) => {
	const neighbors = [];
	for (let r = row - 1; r <= row + 1; r++) {
		for (let c = col - 1; c <= col + 1; c++) {
			if (
				r >= 0 &&
				r < rows &&
				c >= 0 &&
				c < cols &&
				!(r === row && c === col)
			) {
				neighbors.push({ row: r, col: c });
			}
		}
	}
	return neighbors;
};

export const placeMines = (
	cells: Cell[],
	rows: number,
	cols: number,
	mines: number,
	excludeRow: number,
	excludeCol: number
): Cell[] => {
	const totalCells = rows * cols;
	const cellsCopy = [...cells];

	// Helper to add a cell to exclusion set safely
	const addToExcluded = (r: number, c: number, set: Set<string>) => {
		if (r >= 0 && r < rows && c >= 0 && c < cols) {
			set.add(`${r},${c}`);
		}
	};

	// Exclude clicked cell + neighbors (3x3)
	const excludedPositions = new Set<string>();
	for (let r = excludeRow - 1; r <= excludeRow + 1; r++) {
		for (let c = excludeCol - 1; c <= excludeCol + 1; c++) {
			addToExcluded(r, c, excludedPositions);
		}
	}

	// Also exclude neighbors of neighbors (5x5)
	// This ensures the numbers around the clicked cell and its neighbors are zero
	for (let r = excludeRow - 2; r <= excludeRow + 2; r++) {
		for (let c = excludeCol - 2; c <= excludeCol + 2; c++) {
			addToExcluded(r, c, excludedPositions);
		}
	}

	let minesPlaced = 0;
	while (minesPlaced < mines) {
		const randomIndex = Math.floor(Math.random() * totalCells);
		const cell = cellsCopy[randomIndex];

		if (cell.isMine || excludedPositions.has(`${cell.row},${cell.col}`)) {
			continue;
		}
		cell.isMine = true;
		minesPlaced++;
	}

	// After mines placed, calculate numbers
	for (let i = 0; i < cellsCopy.length; i++) {
		const cell = cellsCopy[i];
		if (cell.isMine) {
			cell.number = null;
			continue;
		}

		// count mines in neighbors
		const neighbors = getNeighbors(cell.row, cell.col, rows, cols);
		const mineCount = neighbors.reduce((count, pos) => {
			const neighborCell = cellsCopy.find(
				(c) => c.row === pos.row && c.col === pos.col
			);
			return count + (neighborCell?.isMine ? 1 : 0);
		}, 0);

		cell.number = mineCount;
	}

	return cellsCopy;
};

// Reveal a specific cell
export const revealCell = (cells: Cell[], row: number, col: number): Cell[] => {
	return cells.map((cell) =>
		cell.row === row && cell.col === col ? { ...cell, isRevealed: true } : cell
	);
};

export const getNeighborCells = (
	cells: Cell[],
	rows: number,
	cols: number,
	cell: Cell
): Cell[] => {
	const neighbors: Cell[] = [];

	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	for (const [dRow, dCol] of directions) {
		const nRow = cell.row + dRow;
		const nCol = cell.col + dCol;

		if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
			const neighbor = cells.find((c) => c.row === nRow && c.col === nCol);
			if (neighbor) neighbors.push(neighbor);
		}
	}

	return neighbors;
};
