import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import { Orbitron } from "next/font/google";

const pressStart = Press_Start_2P({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-press-start",
});

const orbitron = Orbitron({
	subsets: ["latin"],
	variable: "--font-orbitron",
});

export const metadata = {
	title: "Mini Arcade",
	description: "Just for Fun and a Little Chaos",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (

		
		<html lang="en" className={`${pressStart.variable} ${orbitron.variable}`}>
			
			<body className="font-retro">{children}</body>
		</html>
	);
}
