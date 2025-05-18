export const difficultyLevels = [
	{ name: "easy", rows: 10, cols: 10, mines: 15}, // 15 mines
	{ name: "medium", rows: 12, cols: 12, mines: 25 }, // 25 mines
	{ name: "hard", rows: 15, cols: 15, mines:45 }, // 39 mines
] as const;

export type DifficultyConfig = (typeof difficultyLevels)[number];
