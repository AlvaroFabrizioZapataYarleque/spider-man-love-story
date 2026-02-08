"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const shuffle = (values: number[]) => {
	const copy = [...values]
	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))
		;[copy[i], copy[j]] = [copy[j], copy[i]]
	}
	return copy
}

export default function JuegoTelaranaPage() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const [level, setLevel] = useState(5)
	const [order, setOrder] = useState<number[]>(() => shuffle([1, 2, 3, 4, 5]))
	const [position, setPosition] = useState(1)
	const done = level >= 10 && position > 10

	const resetRound = (nextLevel: number) => {
		const sequence = Array.from({ length: nextLevel }, (_, i) => i + 1)
		setOrder(shuffle(sequence))
		setPosition(1)
	}

	const handleClick = (value: number) => {
		if (done) return
		if (value === position) {
			const nextPosition = position + 1
			if (nextPosition > level) {
				if (level < 10) {
					const nextLevel = level + 1
					setLevel(nextLevel)
					resetRound(nextLevel)
					return
				}
				setPosition(nextPosition)
				return
			}
			setPosition(nextPosition)
		} else {
			resetRound(level)
		}
	}

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							TEJE LA TELARAÑA
						</h1>
						<p className="text-sm md:text-base font-bold">
							Toca los puntos en orden
						</p>
					</div>
				</div>

				<div className="max-w-md mx-auto comic-panel bg-white border-8 border-black p-6 shadow-2xl text-center">
					<div className="grid grid-cols-5 gap-3 place-items-center">
						{order.map((value) => (
							<button
								key={value}
								onClick={() => handleClick(value)}
								className={`w-16 h-16 rounded-full border-4 border-black font-black ${
									position > value ? "bg-green-300" : "bg-red-300"
								}`}
							>
								{value}
							</button>
						))}
					</div>
					<p className="mt-4 font-black">
						Orden actual: {position}/{Math.min(level, 10)}
					</p>
					<p className="mt-2 font-black">Nivel: {Math.min(level, 10)} de 10</p>
					{done && (
						<p className="mt-3 font-black text-red-600">
							¡Eres súper inteligente y rapidísima! 💖
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
