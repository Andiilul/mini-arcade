import React, { useEffect, useState } from "react";
import { createEmptyCells, handleCellClick } from "./services";
import { Cell } from "./types";

interface Props {
	rows: number;
	cols: number;
	mines: number;
	flagsLeft: number;
	onFlagChange: (newFlags: number) => void;
}

export const MineSweeperBoard: React.FC<Props> = ({
	rows,
	cols,
	mines,
	flagsLeft,
	onFlagChange,
}) => {
	const [isStarted, setIsStarted] = useState(false);
	const [cells, setCells] = useState<Cell[]>([]);
	const [gameOver, setGameOver] = useState(false);
	const [gameWon, setGameWon] = useState(false);
	const [notification, setNotification] = useState<string | null>(null);

	useEffect(() => {
		setCells(createEmptyCells(rows, cols));
		onFlagChange(mines); // reset flag count when new board created
	}, [rows, cols, mines, onFlagChange]);

	const onCellClick = (clickedCell: Cell) => {
		if (gameOver || gameWon || clickedCell.isFlagged) return;

		const { newCells, newIsStarted } = handleCellClick({
			cells,
			rows,
			cols,
			mines,
			isStarted,
			clickedRow: clickedCell.row,
			clickedCol: clickedCell.col,
		});

		setCells(newCells);
		setIsStarted(newIsStarted);

		const clicked = newCells.find(
			(c) => c.row === clickedCell.row && c.col === clickedCell.col
		);

		if (clicked?.isMine) {
			setGameOver(true);
			return;
		}

		const revealedCount = newCells.filter((c) => c.isRevealed).length;
		const nonMineCount = newCells.filter((c) => !c.isMine).length;
		if (revealedCount === nonMineCount) {
			setGameWon(true);
		}
	};

	const onCellRightClick = (
		e: React.MouseEvent<HTMLDivElement>,
		clickedCell: Cell
	) => {
		e.preventDefault();

		if (gameOver || gameWon || clickedCell.isRevealed) return;

		if (!clickedCell.isFlagged && flagsLeft === 0) {
			setNotification("🚫 Flag limit reached!");
			setTimeout(() => setNotification(null), 2000);
			return;
		}

		const updatedCells = cells.map((cell) =>
			cell.row === clickedCell.row && cell.col === clickedCell.col
				? { ...cell, isFlagged: !cell.isFlagged }
				: cell
		);

		setCells(updatedCells);
		// update flag count in parent via callback
		onFlagChange(clickedCell.isFlagged ? flagsLeft + 1 : flagsLeft - 1);
	};

	return (
		<div className="bg-background p-4 max-w-md mx-auto">
			{gameOver && (
				<div className="text-center text-red-700 font-bold mb-2">
					💥 Game Over!
				</div>
			)}
			{gameWon && (
				<div className="text-center text-green-600 font-bold mb-2">
					🎉 You Win!
				</div>
			)}
			{notification && (
				<div className="text-center text-yellow-500 font-medium mb-2">
					{notification}
				</div>
			)}

			{/* Pindahkan numberColors ke sini supaya gak didefinisikan tiap iterasi */}
			{(() => {
				const numberColors: { [key: number]: string } = {
					1: "text-blue-700",
					2: "text-green-700",
					3: "text-red-600",
					4: "text-indigo-700",
					5: "text-yellow-700",
					6: "text-teal-700",
					7: "text-pink-700",
					8: "text-gray-700",
				};

				return (
					<div
						className="grid gap-1"
						style={{ gridTemplateColumns: `repeat(${cols}, 32px)` }}
					>
						{cells.map((cell) => {
							const textColor =
								cell.isRevealed && !cell.isMine && cell.number
									? numberColors[cell.number] || ""
									: "";

							return (
								<div
									key={`${cell.row}-${cell.col}`}
									onClick={() => onCellClick(cell)}
									onContextMenu={(e) => onCellRightClick(e, cell)}
									className={`aspect-square w-8 h-8 border border-gray-300 flex items-center justify-center text-xs font-bold cursor-pointer
                ${
									cell.isRevealed
										? cell.isMine
											? "bg-red-500"
											: "bg-blue-100"
										: "bg-white hover:bg-gray-100"
								} ${textColor}`}
								>
									{cell.isRevealed || gameOver || gameWon
										? cell.isMine
											? "💣"
											: cell.number || ""
										: cell.isFlagged
										? "🚩"
										: ""}
								</div>
							);
						})}
					</div>
				);
			})()}
		</div>
	);
};

export default MineSweeperBoard;
