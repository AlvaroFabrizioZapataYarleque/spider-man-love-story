"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const mazeSize = 11
const start = { row: 1, col: 1 }

const createMaze = () => {
	const grid = Array.from({ length: mazeSize }, () => Array.from({ length: mazeSize }, () => "1"))
	const directions = [
		{ dr: 2, dc: 0 },
		{ dr: -2, dc: 0 },
		{ dr: 0, dc: 2 },
		{ dr: 0, dc: -2 },
	]

	const inBounds = (row: number, col: number) => row > 0 && col > 0 && row < mazeSize - 1 && col < mazeSize - 1
	const shuffle = (list: typeof directions) => {
		const copy = [...list]
		for (let i = copy.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1))
			;[copy[i], copy[j]] = [copy[j], copy[i]]
		}
		return copy
	}

	const carve = (row: number, col: number) => {
		grid[row][col] = "0"
		shuffle(directions).forEach(({ dr, dc }) => {
			const nr = row + dr
			const nc = col + dc
			if (!inBounds(nr, nc) || grid[nr][nc] === "0") return
			grid[row + dr / 2][col + dc / 2] = "0"
			carve(nr, nc)
		})
	}

	carve(start.row, start.col)

	const emptyCells: Array<{ row: number; col: number }> = []
	for (let r = 1; r < mazeSize - 1; r += 1) {
		for (let c = 1; c < mazeSize - 1; c += 1) {
			if (grid[r][c] === "0" && !(r === start.row && c === start.col)) {
				emptyCells.push({ row: r, col: c })
			}
		}
	}
	const target = emptyCells[Math.floor(Math.random() * emptyCells.length)]
	return { grid, target }
}

export default function JuegoMaryJanePage() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const [{ grid, target }, setMaze] = useState(createMaze)
	const [position, setPosition] = useState(start)
	const [finished, setFinished] = useState(false)

	const canMove = (row: number, col: number) => grid[row]?.[col] === "0"

	const move = (dr: number, dc: number) => {
		if (finished) return
		const next = { row: position.row + dr, col: position.col + dc }
		if (!canMove(next.row, next.col)) return
		setPosition(next)
		if (next.row === target.row && next.col === target.col) {
			setFinished(true)
		}
	}

	useEffect(() => {
		const handleKey = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					move(-1, 0)
					break
				case "ArrowDown":
					move(1, 0)
					break
				case "ArrowLeft":
					move(0, -1)
					break
				case "ArrowRight":
					move(0, 1)
					break
				default:
					break
			}
		}
		window.addEventListener("keydown", handleKey)
		return () => window.removeEventListener("keydown", handleKey)
	}, [position, finished, grid])

	useEffect(() => {
		setPosition(start)
		setFinished(false)
		setMaze(createMaze())
	}, [])

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							JUEGO MARY JANE
						</h1>
						<p className="text-sm md:text-base font-bold">
							Elige la flor correcta
						</p>
					</div>
				</div>

				<div className="max-w-md mx-auto comic-panel bg-white border-8 border-black p-6 shadow-2xl text-center">
					<p className="font-black mb-4">Guía a Mary Jane hasta la telaraña</p>
					<div className="grid gap-1 justify-center">
						{grid.map((row, rowIndex) => (
							<div
								key={`row-${rowIndex}`}
								className="grid gap-1"
								style={{ gridTemplateColumns: `repeat(${mazeSize}, minmax(0, 1fr))` }}
							>
								{row.map((cell, colIndex) => {
									const isWall = cell === "1"
									const isPlayer = position.row === rowIndex && position.col === colIndex
									const isTarget = target.row === rowIndex && target.col === colIndex
									return (
										<div
											key={`${rowIndex}-${colIndex}`}
											className={`w-7 h-7 sm:w-8 sm:h-8 border-2 border-black flex items-center justify-center text-sm font-black ${
												isWall ? "bg-black" : "bg-white"
											}`}
										>
											{isPlayer ? "👧" : isTarget ? "🕸️" : ""}
										</div>
									)
								})}
							</div>
						))}
					</div>

					<div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mt-4">
						<div />
						<Button
							size="sm"
							className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400"
							onClick={() => move(-1, 0)}
						>
							⬆️
						</Button>
						<div />
						<Button
							size="sm"
							className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400"
							onClick={() => move(0, -1)}
						>
							⬅️
						</Button>
						<Button
							size="sm"
							className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400"
							onClick={() => move(1, 0)}
						>
							⬇️
						</Button>
						<Button
							size="sm"
							className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400"
							onClick={() => move(0, 1)}
						>
							➡️
						</Button>
					</div>

					<p className="mt-4 text-xs font-bold">Tip: también puedes usar las flechas del teclado.</p>

					{finished && (
						<p className="mt-4 font-black text-red-600">
							¡Llegaste a donde el Hombre Araña! Eres valiente, inteligente y súper rápida 💖
						</p>
					)}
				</div>

				<div className="text-center mt-10">
					<Link href={returnHref}>
						<Button
							size="lg"
							className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105"
						>
							Volver a la historia
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
