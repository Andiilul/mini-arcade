"use client";

import { useParams, useSearchParams } from "next/navigation";
import { difficultyLevels } from "@/games/minesweeper/constants";
import { MineSweeperBoard } from "./minesweeper-board";
import React, { useState } from "react";

const allowedDifficulties = ["easy", "medium", "hard", "custom"];
type Difficulty = (typeof allowedDifficulties)[number];

export default function MineSweeperDifficultyGame() {
	const params = useParams();
	const searchParams = useSearchParams();

	const difficultyName =
		typeof params?.difficulty === "string" &&
		allowedDifficulties.includes(params.difficulty as Difficulty)
			? (params.difficulty as Difficulty)
			: null;

	// State untuk flag count, di-set sesuai mines awal
	const [flagsLeft, setFlagsLeft] = useState<number | null>(null);

	// Reset flagsLeft jika difficulty berubah
	React.useEffect(() => {
		if (!difficultyName) return;
		if (difficultyName === "custom") {
			const rows = Number(searchParams.get("rows"));
			const cols = Number(searchParams.get("cols"));
			const mines = Number(searchParams.get("mines"));
			if (
				!rows ||
				rows <= 0 ||
				!cols ||
				cols <= 0 ||
				!mines ||
				mines <= 0 ||
				mines >= rows * cols
			) {
				setFlagsLeft(null);
				return;
			}
			setFlagsLeft(mines);
		} else {
			const config = difficultyLevels.find((d) => d.name === difficultyName);
			if (config) {
				setFlagsLeft(config.mines);
			} else {
				setFlagsLeft(null);
			}
		}
	}, [difficultyName, searchParams]);

	if (!difficultyName) {
		return <div>Invalid difficulty level</div>;
	}

	if (difficultyName === "custom") {
		const rows = Number(searchParams.get("rows"));
		const cols = Number(searchParams.get("cols"));
		const mines = Number(searchParams.get("mines"));

		if (
			!rows ||
			rows <= 0 ||
			!cols ||
			cols <= 0 ||
			!mines ||
			mines <= 0 ||
			mines >= rows * cols
		) {
			return (
				<div>Error: Invalid or missing custom level parameters in query.</div>
			);
		}

		if (flagsLeft === null) return null; // or loading...

		return (
			<main
				className="w-screen max-h-screen h-[720px] bg-background bg-cover bg-center flex items-center justify-center p-4"
				onContextMenu={(e) => e.preventDefault()}
			>
				<section className="flex flex-col items-center justify-center">
					<h1>Custom Mode</h1>
					<p>
						Grid: {rows} x {cols}
					</p>
					<p>Mines: {mines}</p>
					<div className="text-center mb-2">🚩 Flags left: {flagsLeft}</div>
				</section>
				<MineSweeperBoard
					rows={rows}
					cols={cols}
					mines={mines}
					flagsLeft={flagsLeft}
					onFlagChange={setFlagsLeft}
				/>
			</main>
		);
	}

	const config = difficultyLevels.find((d) => d.name === difficultyName);
	if (!config) return <div>Difficulty config not found</div>;

	if (flagsLeft === null) return null; // or loading...

	return (
		<main
			className="w-screen max-h-screen h-[720px] bg-background bg-cover bg-center flex items-center justify-center p-4"
			onContextMenu={(e) => e.preventDefault()}
		>
			<section className="flex flex-col items-center justify-center">
				<h1>{config.name.toUpperCase()} Mode</h1>
				<p>
					Grid: {config.rows} x {config.cols}
				</p>
				<p>Mines: {config.mines}</p>
				<div className="text-center mb-2">🚩 Flags left: {flagsLeft}</div>
			</section>
			<MineSweeperBoard
				rows={config.rows}
				cols={config.cols}
				mines={config.mines}
				flagsLeft={flagsLeft}
				onFlagChange={setFlagsLeft}
			/>
		</main>
	);
}
