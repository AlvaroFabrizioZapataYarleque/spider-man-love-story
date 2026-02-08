"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

function JuegoSuperpoderPageContent() {
	const searchParams = useSearchParams()
	const returnPage = searchParams.get("page") ?? "0"
	const returnHref = `/?page=${returnPage}`
	const [power, setPower] = useState(0)
	const done = power >= 100

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="container mx-auto px-4 py-10 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black inline-block">
						<h1 className="text-3xl md:text-5xl font-black comic-font tracking-wider">
							SUPERPODER FAVORITO
						</h1>
						<p className="text-sm md:text-base font-bold">
							Carga el poder para hacerla sonreír
						</p>
					</div>
				</div>

				<div className="max-w-md mx-auto comic-panel bg-white border-8 border-black p-6 shadow-2xl text-center">
					<div className="w-full bg-gray-200 border-2 border-black h-6 mb-4">
						<div className="bg-red-500 h-full" style={{ width: `${Math.min(power, 100)}%` }} />
					</div>
					<p className="font-black mb-4">Poder: {Math.min(power, 100)}%</p>
					<Button
						onClick={() => setPower((prev) => Math.min(100, prev + 10))}
						size="lg"
						className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105"
					>
						Cargar poder
					</Button>
					{done && (
						<p className="mt-4 font-black text-red-600">
							Obtuviste poder 100 hora eres una superchica!! ❤️
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

export default function JuegoSuperpoderPage() {
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
			<JuegoSuperpoderPageContent />
		</Suspense>
	)
}
