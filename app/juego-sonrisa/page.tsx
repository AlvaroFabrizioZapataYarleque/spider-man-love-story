"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const icons = ["💖", "🕷️", "🌹", "😄", "🕸️", "🌟"]

export default function JuegoSonrisaPage() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const cards = useMemo(() => {
		const pairs = [...icons, ...icons]
		for (let i = pairs.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1))
			;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
		}
		return pairs
	}, [])
	const [flipped, setFlipped] = useState<number[]>([])
	const [matched, setMatched] = useState<Set<number>>(new Set())
	const [block, setBlock] = useState(false)
	const done = matched.size === cards.length

	useEffect(() => {
		if (flipped.length !== 2) return
		const [first, second] = flipped
		if (cards[first] === cards[second]) {
			setMatched((prev) => new Set(prev).add(first).add(second))
			setFlipped([])
			return
		}
		setBlock(true)
		const timer = setTimeout(() => {
			setFlipped([])
			setBlock(false)
		}, 800)
		return () => clearTimeout(timer)
	}, [flipped, cards])

	const handleFlip = (index: number) => {
		if (block) return
		if (matched.has(index)) return
		if (flipped.includes(index)) return
		if (flipped.length >= 2) return
		setFlipped((prev) => [...prev, index])
	}

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							JUEGO DE LA SONRISA
						</h1>
						<p className="text-sm md:text-base font-bold">
							Haz clic para llenar el medidor de sonrisa
						</p>
					</div>
				</div>

				<div className="max-w-md mx-auto comic-panel bg-white border-8 border-black p-6 shadow-2xl text-center">
					<p className="font-black mb-4">Encuentra todas las parejas</p>
					<div className="grid grid-cols-4 gap-3">
						{cards.map((icon, index) => {
							const isOpen = flipped.includes(index) || matched.has(index)
							return (
								<button
									key={`${icon}-${index}`}
									onClick={() => handleFlip(index)}
									className="aspect-square border-4 border-black text-2xl font-black bg-white hover:scale-105 transform"
								>
									{isOpen ? icon : "❔"}
								</button>
							)
						})}
					</div>
					{done && (
						<p className="mt-4 font-black text-red-600 comic-font">
							¡Lo lograste! Tu memoria es brillante y tu corazón aún más 💖
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
