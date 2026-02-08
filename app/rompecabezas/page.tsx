"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const puzzleSize = 3
const puzzleImage = "/fotos/foto2.jpg"

const mulberry32 = (seed: number) => {
	let t = seed
	return () => {
		t = (t + 0x6d2b79f5) | 0
		let r = Math.imul(t ^ (t >>> 15), 1 | t)
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296
	}
}

function RompecabezasPageContent() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const [pieces, setPieces] = useState<number[]>(() => {
		const total = puzzleSize * puzzleSize
		const initial = Array.from({ length: total }, (_, i) => i)
		const rand = mulberry32(90210)
		for (let i = initial.length - 1; i > 0; i -= 1) {
			const j = Math.floor(rand() * (i + 1))
			;[initial[i], initial[j]] = [initial[j], initial[i]]
		}
		return initial
	})
	const [dragIndex, setDragIndex] = useState<number | null>(null)
	const isSolved = pieces.every((piece, index) => piece === index)

	const handleDragStart = (index: number) => {
		setDragIndex(index)
	}

	const handleDrop = (index: number) => {
		if (dragIndex === null || dragIndex === index) return
		setPieces((prev) => {
			const next = [...prev]
			;[next[dragIndex], next[index]] = [next[index], next[dragIndex]]
			return next
		})
		setDragIndex(null)
	}

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							ROMPECABEZAS
						</h1>
						<p className="text-sm md:text-base font-bold">
							Arma la foto arrastrando las piezas
						</p>
					</div>
				</div>

				<div className="max-w-md sm:max-w-3xl mx-auto">
					<div className="comic-panel bg-white border-8 border-black p-4 sm:p-6 shadow-2xl">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-xl font-black comic-font">Rompecabezas</h2>
							<span className="text-xs font-black bg-yellow-200 border-2 border-black px-2 py-1">
								{isSolved ? "¡Completado!" : "Arrastra para armar"}
							</span>
						</div>
						<div
							className="grid gap-1 sm:gap-2"
							style={{ gridTemplateColumns: `repeat(${puzzleSize}, minmax(0, 1fr))` }}
						>
							{pieces.map((piece, index) => {
								const row = Math.floor(piece / puzzleSize)
								const col = piece % puzzleSize
								return (
									<div
										key={`${piece}-${index}`}
										draggable
										onDragStart={() => handleDragStart(index)}
										onDragOver={(event) => event.preventDefault()}
										onDrop={() => handleDrop(index)}
										className="aspect-square border-4 border-black shadow-lg cursor-grab active:cursor-grabbing"
										style={{
											backgroundImage: `url(${puzzleImage})`,
											backgroundSize: `${puzzleSize * 100}% ${puzzleSize * 100}%`,
											backgroundPosition: `${(col / (puzzleSize - 1)) * 100}% ${(row / (puzzleSize - 1)) * 100}%`,
										}}
									/>
								)
							})}
						</div>
						<p className="text-xs mt-3 font-bold text-black">
							Tip: arrastra una pieza sobre otra para intercambiarlas.
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

export default function RompecabezasPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-white relative overflow-hidden comic-page">
					<div className="container mx-auto px-4 py-10 relative z-10">
						<div className="comic-panel bg-white border-8 border-black p-6 shadow-2xl text-center font-black">
							Cargando...
						</div>
					</div>
				</div>
			}
		>
			<RompecabezasPageContent />
		</Suspense>
	)
}
