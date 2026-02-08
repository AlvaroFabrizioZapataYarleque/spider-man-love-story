"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const words = [
	"ALTA",
	"BLANCA",
	"HERMOSA",
	"INTELIGENTE",
	"LUCHADORA",
	"FUERTE",
	"SONRISA",
	"ORGANIZATIVA",
	"CAPRICHOSA",
	"BELLA",
	"BRILLANTE",
	"VALIENTE",
	"DULCE",
]

const gridSize = 12
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const directions = [
	{ dr: 0, dc: 1 },
	{ dr: 0, dc: -1 },
	{ dr: 1, dc: 0 },
	{ dr: -1, dc: 0 },
	{ dr: 1, dc: 1 },
	{ dr: -1, dc: -1 },
	{ dr: 1, dc: -1 },
	{ dr: -1, dc: 1 },
]

type Cell = { row: number; col: number }

const highlightColors = [
	"bg-pink-300",
	"bg-blue-300",
	"bg-green-300",
	"bg-purple-300",
	"bg-orange-300",
	"bg-teal-300",
	"bg-rose-300",
	"bg-indigo-300",
]

const mulberry32 = (seed: number) => {
	let t = seed
	return () => {
		t = (t + 0x6d2b79f5) | 0
		let r = Math.imul(t ^ (t >>> 15), 1 | t)
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296
	}
}

const createGrid = (wordList: string[], size: number, rand: () => number) => {
	const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ""))
	const sorted = [...wordList].sort((a, b) => b.length - a.length)

	const canPlace = (word: string, row: number, col: number, dr: number, dc: number) => {
		for (let i = 0; i < word.length; i += 1) {
			const r = row + dr * i
			const c = col + dc * i
			if (r < 0 || r >= size || c < 0 || c >= size) return false
			const cell = grid[r][c]
			if (cell && cell !== word[i]) return false
		}
		return true
	}

	const placeWord = (word: string) => {
		for (let attempt = 0; attempt < 250; attempt += 1) {
			const dir = directions[Math.floor(rand() * directions.length)]
			const startRow = Math.floor(rand() * size)
			const startCol = Math.floor(rand() * size)
			if (!canPlace(word, startRow, startCol, dir.dr, dir.dc)) continue
			for (let i = 0; i < word.length; i += 1) {
				const r = startRow + dir.dr * i
				const c = startCol + dir.dc * i
				grid[r][c] = word[i]
			}
			return true
		}
		return false
	}

	sorted.forEach((word) => placeWord(word))

	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			if (!grid[r][c]) {
				grid[r][c] = alphabet[Math.floor(rand() * alphabet.length)]
			}
		}
	}

	return grid
}

export default function PupiletraPage() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const [isSelecting, setIsSelecting] = useState(false)
	const [startCell, setStartCell] = useState<Cell | null>(null)
	const [endCell, setEndCell] = useState<Cell | null>(null)
	const [foundCells, setFoundCells] = useState<Map<string, string>>(new Map())
	const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
	const [wordColors, setWordColors] = useState<Map<string, string>>(new Map())

	const gridLetters = useMemo(() => {
		const rand = mulberry32(2210)
		return createGrid(words, gridSize, rand)
	}, [])
	const colCount = gridLetters[0]?.length ?? 0

	const getKey = (row: number, col: number) => `${row}-${col}`

	const getLineCells = (start: Cell, end: Cell) => {
		const cells: Cell[] = []
		const rowDiff = end.row - start.row
		const colDiff = end.col - start.col

		const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff)
		if (rowDiff !== 0 && colDiff !== 0 && !isDiagonal) return cells

		const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1
		const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1
		const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1

		for (let i = 0; i < length; i += 1) {
			const row = start.row + i * rowStep
			const col = start.col + i * colStep
			cells.push({ row, col })
		}
		return cells
	}

	const getWordFromCells = (cells: Cell[]) =>
		cells.map((cell) => gridLetters[cell.row][cell.col]).join("")

	const activeSelection = useMemo(() => {
		if (!isSelecting || !startCell || !endCell) return []
		return getLineCells(startCell, endCell)
	}, [isSelecting, startCell, endCell])

	const handlePointerDown = (cell: Cell) => {
		setIsSelecting(true)
		setStartCell(cell)
		setEndCell(cell)
	}

	const handlePointerEnter = (cell: Cell) => {
		if (!isSelecting) return
		setEndCell(cell)
	}

	const finalizeSelection = () => {
		if (!startCell || !endCell) {
			setIsSelecting(false)
			return
		}
		const cells = getLineCells(startCell, endCell)
		if (cells.length === 0) {
			setIsSelecting(false)
			setStartCell(null)
			setEndCell(null)
			return
		}
		const word = getWordFromCells(cells)
		const reversed = word.split("").reverse().join("")
		const matchedWord = words.find((w) => w === word || w === reversed)

		if (matchedWord) {
			setFoundWords((prev) => new Set(prev).add(matchedWord))
			const assignedColor = wordColors.get(matchedWord)
			const colorToUse = assignedColor ?? highlightColors[wordColors.size % highlightColors.length]
			setWordColors((prev) => {
				if (prev.has(matchedWord)) return new Map(prev)
				const next = new Map(prev)
				next.set(matchedWord, colorToUse)
				return next
			})
			setFoundCells((prev) => {
				const next = new Map(prev)
				cells.forEach((cell) => next.set(getKey(cell.row, cell.col), colorToUse))
				return next
			})
		}

		setIsSelecting(false)
		setStartCell(null)
		setEndCell(null)
	}

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							PUPILETRA DEL AMOR
						</h1>
						<p className="text-sm md:text-base font-bold">
							Encuentra las palabras que describen a Jimena
						</p>
					</div>
				</div>

				<div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[1fr_320px]">
						<div
							className="comic-panel bg-white border-8 border-black p-4 sm:p-6 shadow-2xl"
							onPointerUp={finalizeSelection}
							onPointerLeave={() => isSelecting && finalizeSelection()}
						>
							<div className="grid gap-2 select-none font-mono">
							{gridLetters.map((row, rowIndex) => (
								<div
									key={`row-${rowIndex}`}
										className={`grid gap-1 text-center font-black text-[13px] sm:text-lg tracking-wide`}
									style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
								>
									{row.map((letter, colIndex) => {
										const key = getKey(rowIndex, colIndex)
										const cellColor = foundCells.get(key)
										const isFound = Boolean(cellColor)
										const isActive = activeSelection.some(
											(cell) => cell.row === rowIndex && cell.col === colIndex,
										)
										return (
											<div
												key={key}
												className={`border-2 border-black py-1 sm:py-2 touch-none cursor-pointer ${
													isFound
														? cellColor
														: isActive
														? "bg-yellow-300"
														: "bg-yellow-100"
												} text-black`}
												onPointerDown={() => handlePointerDown({ row: rowIndex, col: colIndex })}
												onPointerEnter={() => handlePointerEnter({ row: rowIndex, col: colIndex })}
											>
												{letter}
											</div>
										)
									})}
								</div>
							))}
						</div>
						</div>

						<div className="comic-panel bg-white border-8 border-black p-4 sm:p-6 shadow-2xl">
						<h2 className="text-xl font-black comic-font mb-4">Palabras</h2>
							<ul className="grid grid-cols-2 gap-2 text-[11px] sm:text-sm font-bold font-mono tracking-wide">
							{words.map((word) => (
								<li
									key={word}
									className={`border-2 border-black px-2 py-1 text-center ${
										foundWords.has(word)
											? `${wordColors.get(word) ?? "bg-green-200"} line-through`
											: "bg-white"
									}`}
								>
									{word}
								</li>
							))}
						</ul>
						<p className="text-xs mt-4 font-bold text-black">
							Tip: arrastra en horizontal, vertical o diagonal para encerrar palabras.
						</p>
					</div>
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
