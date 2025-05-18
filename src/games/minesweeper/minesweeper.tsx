"use client";
import Link from "next/link";
import React from "react";

export const MineSweeperMenu: React.FC = () => {
	const [openCustom, setOpenCustom] = React.useState(false);
	const [customValues, setCustomValues] = React.useState({
		rows: 0,
		cols: 0,
		mines: 0,
	});
	const handleCloseCustom = () => {
		setOpenCustom(false);
		setCustomValues({ rows: 0, cols: 0, mines: 0 });
	};
	const playCustomGame = (row: number, col: number, mines: number) => {
		const totalCells = row * col;

		if (row <= 5) {
			alert("Rows must be greater than 5.");
			return;
		}

		if (col <= 5) {
			alert("Columns must be greater than 5.");
			return;
		}

		if (mines <= 5) {
			alert("Mines must be greater than 5.");
			return;
		}

		if (mines >= totalCells) {
			alert("Mines must be less than the total number of cells.");
			return;
		}

		if (mines >= Math.floor(totalCells / 2)) {
			alert("Mines must be less than 50% of the total cells.");
			return;
		}

		window.location.href = `/minesweeper/custom?rows=${row}&cols=${col}&mines=${mines}`;
	};

	return (
		<main>
			<div className="flex flex-col items-center justify-center h-screen bg-background text-white">
				<h1 className="text-4xl font-bold mb-8">Minesweeper</h1>
				<div className="flex flex-col space-y-4">
					{!openCustom && (
						<section className="flex flex-col gap-3">
							<p className="text-lg mb-4">Choose your difficulty:</p>

							<Link
								href="/minesweeper/easy"
								className="hover:text-primary duration-200 cursor-pointer"
							>
								- Easy
							</Link>
							<Link
								href="/minesweeper/medium"
								className="hover:text-primary duration-200 cursor-pointer"
							>
								- Medium
							</Link>
							<Link
								href="/minesweeper/hard"
								className="hover:text-primary duration-200 cursor-pointer"
							>
								- Hard
							</Link>
							<div
								onClick={() => setOpenCustom(true)}
								className="hover:text-primary duration-200 cursor-pointer"
							>
								- Custom
							</div>
						</section>
					)}

					{openCustom && (
						<section className="p-4 border-secondary/20 border-1 flex flex-col gap-4">
							<div className="width-full flex justify-start">
								<button
									type={"button"}
									onClick={handleCloseCustom}
									className="cursor-pointer text-gray-600 hover:text-red-500"
								>
									X
								</button>
							</div>
							<div className="flex flex-col items-center">
								<p className="text-lg mb-2">Enter custom values:</p>
								<input
									type="number"
									placeholder="Rows"
									className="mb-2 p-2 border border-gray-300 rounded"
									min={1}
									step={1}
									value={customValues.rows}
									onChange={(e) =>
										setCustomValues({
											...customValues,
											rows: parseInt(e.target.value) || 0,
										})
									}
								/>

								<input
									type="number"
									placeholder="Columns"
									className="mb-2 p-2 border border-gray-300 rounded"
									min={1}
									step={1}
									value={customValues.cols}
									onChange={(e) =>
										setCustomValues({
											...customValues,
											cols: parseInt(e.target.value) || 0,
										})
									}
								/>

								<input
									type="number"
									placeholder="Mines"
									className="mb-2 p-2 border border-gray-300 rounded"
									min={1}
									step={1}
									value={customValues.mines}
									onChange={(e) =>
										setCustomValues({
											...customValues,
											mines: parseInt(e.target.value) || 0,
										})
									}
								/>

								<div
									onClick={() =>
										playCustomGame(
											customValues.rows,
											customValues.cols,
											customValues.mines
										)
									}
									className="hover:text-primary duration-200 cursor-pointer"
								>
									Start Game
								</div>
							</div>
						</section>
					)}
				</div>
			</div>
		</main>
	);
};
