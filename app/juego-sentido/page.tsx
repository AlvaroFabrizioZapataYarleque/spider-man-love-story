"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

function JuegoSentidoPageContent() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const [ready, setReady] = useState(false)
	const [reaction, setReaction] = useState<number | null>(null)
	const [records, setRecords] = useState<number[]>([])
	const startRef = useRef<number | null>(null)
	const timerRef = useRef<number | null>(null)

	const startRound = () => {
		setReady(true)
		startRef.current = performance.now()
	}

	useEffect(() => {
		startRound()
		return () => {
			if (timerRef.current) {
				window.clearTimeout(timerRef.current)
			}
		}
	}, [])

	const handleClick = () => {
		if (!ready || startRef.current === null) return
		const time = Math.round(performance.now() - startRef.current)
		setReaction(time)
		setReady(false)
		setRecords((prev) => [time, ...prev].slice(0, 10))
		if (timerRef.current) {
			window.clearTimeout(timerRef.current)
		}
		timerRef.current = window.setTimeout(() => {
			setReaction(null)
			startRound()
		}, 8000)
	}

	const message = reaction
		? reaction < 350
			? "¡Sentido arácnido súper rápido! 🕷️"
			: "¡Buen reflejo!"
		: ready
		? "¡Toca ahora!"
		: "Espera 8 segundos para el siguiente intento"

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							SENTIDO ARÁCNIDO
						</h1>
						<p className="text-sm md:text-base font-bold">
							Toca cuando aparezca la señal
						</p>
					</div>
				</div>

				<div className="max-w-md mx-auto comic-panel bg-white border-8 border-black p-6 shadow-2xl text-center">
					<Button
						onClick={handleClick}
						size="lg"
						className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105 w-full"
					>
						{ready ? "¡TOCA YA!" : "Esperando..."}
					</Button>
					<p className="mt-4 font-black">{message}</p>
					{reaction && <p className="mt-2 font-black">Tiempo: {reaction} ms</p>}
					{records.length > 0 && (
						<div className="mt-4">
							<p className="font-black mb-2">Tus últimos 10 reflejos</p>
							<ul className="grid grid-cols-2 gap-2 text-sm font-bold">
								{records.map((record, index) => (
									<li
										key={`${record}-${index}`}
										className="border-2 border-black bg-white px-2 py-1 text-center"
									>
										{record} ms
									</li>
								))}
							</ul>
						</div>
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

export default function JuegoSentidoPage() {
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
			<JuegoSentidoPageContent />
		</Suspense>
	)
}
