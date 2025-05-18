export const games = [
	{
		name: "MineSweeper",
		description: "A classic game of logic and deduction.",
		image: "/images/minesweeper.png",
		link: "/minesweeper",
	},
	{
		name: "2048Clone",
		description: "A simple and addictive sliding block puzzle game.",
		image: "/images/2048Clone.png",
		link: "/2048Clone",
	},
	{
		name: "Sudoku",
		description: "A classic number puzzle game.",
		image: "/images/sudoku.png",
		link: "/sudoku",
	},
];

export default function Home() {
	return (
		<div>
			<main className="relative w-screen max-h-screen h-[720px] bg-[url('/images/home.jpg')] bg-cover bg-center flex items-center justify-center">
				<section className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
					<p className=" text-primary text-[16px]">Mini Arcade</p>
					<p className="text-white font-orbitron text-[64px] text-center font-bold">
						Just for Fun
						<br />
						and a Little Chaos{" "}
					</p>
					<button
						type="button"
						className="text-white hover:text-primary text-[24px] transition-colors duration-[200ms] animate-hop cursor-pointer"
					>
						Get Started
					</button>
				</section>
			</main>
			<main className="w-screen max-h-screen h-[720px] bg-background bg-cover bg-center flex items-center justify-center">
				<section className="grid p-16 grid-cols-3 w-full h-full">
					{games.map((game) => (
						<div
							key={game.name}
							className="relative flex flex-col items-center justify-center bg-white/10 rounded-lg p-4 m-4"
						>
							<h2 className="text-primary text-[24px] font-bold">
								{game.name}
							</h2>
							<p className="text-white text-[16px]">{game.description}</p>
							<a
								href={game.link}
								className="absolute bottom-4 right-4 text-primary hover:text-white transition-colors duration-[200ms]"
							>
								Play Now
							</a>
						</div>
					))}
				</section>
			</main>
		</div>
	);
}
