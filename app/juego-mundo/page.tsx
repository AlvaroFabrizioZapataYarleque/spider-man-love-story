"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function JuegoMundoPage() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const [value, setValue] = useState(() => {
		const initial = Math.floor(Math.random() * 101)
		return initial === 50 ? 49 : initial
	})
	const inRange = value === 50
	const [timeLeft, setTimeLeft] = useState(10)
	const [finished, setFinished] = useState(false)
	const [success, setSuccess] = useState(false)

	useEffect(() => {
		if (finished) return
		if (timeLeft <= 0) {
			setFinished(true)
			setSuccess(false)
			return
		}
		const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
		return () => clearTimeout(timer)
	}, [timeLeft, finished])

	useEffect(() => {
		if (finished) return
		if (inRange) {
			setFinished(true)
			setSuccess(true)
		}
	}, [inRange, finished])

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							EQUILIBRA EL MUNDO
						</h1>
						<p className="text-sm md:text-base font-bold">
							Ajusta el nivel hasta el punto perfecto
						</p>
					</div>
				</div>

				<div className="max-w-md mx-auto comic-panel bg-white border-8 border-black p-6 shadow-2xl text-center">
					<div className="text-4xl mb-4">🌍</div>
					<input
						type="range"
						min={0}
						max={100}
						value={value}
						onChange={(event) => setValue(Number(event.target.value))}
						className="w-full"
					/>
					<p className="font-black mt-3">Nivel: {value}</p>
					<p className="mt-2 font-black">Tiempo: {timeLeft}s</p>
					{!finished && (
						<p className="mt-3 font-black text-black">
							Ajusta el equilibrio exacto a 50
						</p>
					)}
					{finished && success && (
						<p className="mt-3 font-black text-red-600">
							¡Pusiste nuestro mundo en equilibrio perfecto! 🌍💖
						</p>
					)}
					{finished && !success && (
						<p className="mt-3 font-black text-black">
							El mundo se desequilibró... pero contigo siempre hay esperanza 🌟
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
