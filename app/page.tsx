"use client"

import { Suspense, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Heart, Volume2, VolumeX } from "lucide-react"
import { useAudio } from "@/components/audio-provider"

const pages = [
	{
		id: 1,
		title: "¡Hola! Soy tu amigable Spider-Man de al lado",
		message:
			"Y hoy tengo una misión muy especial... ayudar a alguien a confesar algo muy importante. ¿Estás listo para esta aventura romántica?",
		spiderText: "¡Con grandes sentimientos vienen grandes confesiones!",
		image: "/fotos/foto1.jpg",
	},
	{
		id: 2,
		title: "Desde el primer momento...",
		message:
			"Cuando te vi por primera vez, sentí como si hubiera sido picado por una araña radioactiva... pero en lugar de superpoderes, obtuve mariposas en el estómago.",
		spiderText: "¡Eso sí que es un origen romántico!",
		image: "/fotos/foto2.jpg",
	},
	{
		id: 3,
		title: "Tu sonrisa es mi kriptonita",
		message: "Cada vez que sonríes, pierdo todos mis poderes... excepto el de enamorarme más de ti cada día.",
		spiderText: "¡Ups! Esa es de Superman, pero funciona igual de bien 😄",
		image: "/fotos/foto3.jpg",
	},
	{
		id: 4,
		title: "Eres mi Mary Jane",
		message: "En todas las historias de Spider-Man, siempre hay una chica especial. Tú eres esa chica en mi historia.",
		spiderText: "¡Y qué historia tan hermosa estamos escribiendo!",
		image: "/fotos/foto4.jpg",
	},
	{
		id: 5,
		title: "Contigo, el mundo tiene sentido",
		message:
			"Antes de conocerte, solo era un chico normal. Ahora, cada día contigo se siente como una aventura de superhéroe.",
		spiderText: "¡Los mejores equipos siempre son de dos!",
		image: "/fotos/foto5.jpg",
	},
	{
		id: 6,
		title: "Tejes telarañas en mi corazón",
		message: "Has capturado mi corazón en la telaraña más hermosa que existe: el amor verdadero.",
		spiderText: "¡Esa sí que es una telaraña que no quiero romper nunca!",
		image: "/fotos/foto6.jpg",
	},
	{
		id: 7,
		title: "Eres mi superpoder favorito",
		message:
			"Puedo trepar paredes, lanzar telarañas y salvar la ciudad... pero mi superpoder favorito es hacerte sonreír.",
		spiderText: "¡Y vaya que lo haces bien!",
		image: "/fotos/foto7.jpg",
	},
	{
		id: 8,
		title: "Mi sentido arácnido me dice...",
		message:
			"Que estás a punto de descubrir algo muy importante. Mi corazón ha estado enviando señales todo este tiempo...",
		spiderText: "¡El momento de la verdad se acerca!",
		image: "/fotos/foto8.jpg",
	},
	{
		id: 9,
		title: "¡La gran revelación!",
		message: "La gran revelación: eres tú, ¿estás apta para ser mi Mary Jane? ❤️",
		spiderText: "¡Misión cumplida! ¡El amor siempre gana!",
		isConfession: true,
		image: "/spider-man-animated-movie-style-character-in-red-a.jpg",
	},
]

const quizQuestions = [
	{
		id: 1,
		question: "¿Cómo me llamo?",
		options: ["Alvaro", "Diego", "Fernando", "Luis"],
		correctIndex: 0,
	},
	{
		id: 2,
		question: "¿Dónde te conocí?",
		options: ["En la playa", "En el parque", "En el cine", "En el colegio"],
		correctIndex: 1,
	},
	{
		id: 3,
		question: "¿Cómo te llamas?",
		options: ["Jimena", "Camila", "Daniela", "Valeria"],
		correctIndex: 0,
	},
	{
		id: 4,
		question: "¿Cuál es mi color favorito?",
		options: ["Rojo", "Azul", "Verde", "Negro"],
		correctIndex: 1,
	},
	{
		id: 5,
		question: "¿Cuántos años tengo?",
		options: ["20", "21", "22", "23"],
		correctIndex: 2,
	},
	{
		id: 6,
		question: "¿Cuál es nuestra fecha de aniversario?",
		options: ["10 de febrero", "14 de febrero", "10 de marzo", "12 de enero"],
		correctIndex: 0,
	},
	{
		id: 7,
		question: "¿Cuánto tiempo llevamos juntos?",
		options: ["2 años", "3 años", "4 años", "5 años"],
		correctIndex: 2,
	},
	{
		id: 8,
		question: "¿Cuál es mi comida favorita?",
		options: ["Ceviche", "Pizza", "Tallarines verdes", "Hamburguesa"],
		correctIndex: 2,
	},
]

function SpiderManLoveStoryContent() {
	const searchParams = useSearchParams()
	const [currentPage, setCurrentPage] = useState(0)
	const [showConfetti, setShowConfetti] = useState(false)
	const { isPlaying, toggle } = useAudio()
	const [quizIndex, setQuizIndex] = useState(0)
	const [quizScore, setQuizScore] = useState(0)
	const [quizCompleted, setQuizCompleted] = useState(false)
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
	const [answerFeedback, setAnswerFeedback] = useState<"correct" | "incorrect" | null>(null)

	useEffect(() => {
		const pageParam = Number(searchParams.get("page"))
		if (!Number.isNaN(pageParam) && pageParam >= 0 && pageParam < pages.length) {
			setCurrentPage(pageParam)
		}
	}, [searchParams])

	const toggleAudio = () => {
		toggle()
	}

	useEffect(() => {
		if (currentPage !== 8) return
		setQuizIndex(0)
		setQuizScore(0)
		setQuizCompleted(false)
		setSelectedAnswer(null)
		setAnswerFeedback(null)
	}, [currentPage])

	useEffect(() => {
		if (currentPage === 8 && quizCompleted) {
			setShowConfetti(true)
			const timer = setTimeout(() => setShowConfetti(false), 5000)
			return () => clearTimeout(timer)
		}
	}, [currentPage, quizCompleted])

	const nextPage = () => {
		if (currentPage < pages.length - 1) {
			setCurrentPage(currentPage + 1)
		}
	}

	const prevPage = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1)
		}
	}

	const currentPageData = pages[currentPage]
	const isFinalPage = currentPageData.isConfession
	const currentQuestion = quizQuestions[quizIndex]
	const totalQuestions = quizQuestions.length
	const revealConfession = !isFinalPage || quizCompleted
	const quizPercentage = totalQuestions > 0 ? Math.round((quizScore / totalQuestions) * 100) : 0
	const passedQuiz = quizPercentage >= 80
	const confessionText = passedQuiz
		? "La gran revelación: eres tú, estás apta para ser mi Mary Jane 💙🕸️"
		: "No me conoces mucho... disculpa, pero no eres mi Mary Jane 😔"
	const showWordSearchCta = currentPageData.id === 1
	const showPuzzleCta = currentPageData.id === 2
	const gameLinks: Record<number, { href: string; label: string }> = {
		3: { href: "/juego-sonrisa", label: "Juega aquí Princesa 😄" },
		4: { href: "/juego-mary-jane", label: "Juega aquí Amorcito 🌹" },
		5: { href: "/juego-mundo", label: "Juega aquí Mi loquita 🥰" },
		6: { href: "/juego-telarana", label: "Juega aquí Querida 🕸️" },
		7: { href: "/juego-superpoder", label: "Juega aquí China 💥" },
		8: { href: "/juego-sentido", label: "Juega aquí Mi amor 🕷️" },
	}
	const gameLink = gameLinks[currentPageData.id]
	const returnQuery = `?page=${currentPage}`

	const handleAnswer = (optionIndex: number) => {
		if (selectedAnswer !== null || !currentQuestion) return
		setSelectedAnswer(optionIndex)
		if (optionIndex === currentQuestion.correctIndex) {
			setAnswerFeedback("correct")
			setQuizScore((prev) => prev + 1)
		} else {
			setAnswerFeedback("incorrect")
		}
	}

	const nextQuestion = () => {
		if (!currentQuestion) return
		if (quizIndex < totalQuestions - 1) {
			setQuizIndex((prev) => prev + 1)
			setSelectedAnswer(null)
			setAnswerFeedback(null)
		} else {
			setQuizCompleted(true)
		}
	}

	return (
		<div className="min-h-screen bg-white relative overflow-hidden comic-page">
			<div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
				<Button
					onClick={toggleAudio}
					size="lg"
					className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105 shadow-xl"
				>
					{isPlaying ? (
						<Volume2 className="w-6 h-6" />
					) : (
						<VolumeX className="w-6 h-6" />
					)}
				</Button>
			</div>

			<div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50">
				<div className="comic-music-indicator bg-yellow-300 border-4 border-black p-2 sm:p-3 transform -rotate-2 shadow-lg">
					<div className="flex items-center gap-2">
						<span className="text-xl sm:text-2xl">🎵</span>
						<div className="text-black font-black text-xs sm:text-sm">
							<div>SUNFLOWER</div>
							<div className="text-[10px] sm:text-xs">Post Malone & Swae Lee</div>
						</div>
					</div>
				</div>
			</div>

			<div className="absolute inset-0 opacity-10">
				<div className="comic-dots"></div>
			</div>

			<div className="container mx-auto px-4 py-8 relative z-10">
				<div className="text-center mb-8">
					<div className="comic-title-banner bg-black text-white p-2 sm:p-4 transform -rotate-1 shadow-lg border-4 border-black">
						<h1 className="text-4xl md:text-6xl font-black text-white mb-2 comic-font tracking-wider">
							SPIDER-LOVE STORY
						</h1>
						<p className="text-lg font-bold">
							¡UNA AVENTURA ROMÁNTICA EN 9 VIÑETAS!
						</p>
					</div>
				</div>

				<div className="text-center mb-6">
					<div className="inline-block bg-black text-white px-6 py-2 transform rotate-1 comic-badge">
						<span className="font-black text-lg">
							VIÑETA {currentPage + 1} DE {pages.length}
						</span>
					</div>
				</div>

				<div className="max-w-4xl mx-auto">
					<div className="comic-panel bg-white border-8 border-black p-4 sm:p-8 md:p-12 shadow-2xl relative transform hover:scale-105 transition-transform">
						<div className="absolute top-20 -right-8 z-20">
							<div className="relative comic-character">
								<div className="w-32 h-32 relative">
									<div className="spider-man-comic bg-red-600 w-full h-full rounded-full border-4 border-black relative overflow-hidden">
										<div className="absolute inset-2 bg-red-600 rounded-full">
											<div className="absolute top-6 left-4 w-8 h-12 bg-white rounded-full border-2 border-black transform -rotate-12"></div>
											<div className="absolute top-6 right-4 w-8 h-12 bg-white rounded-full border-2 border-black transform rotate-12"></div>
											<div className="absolute inset-0 web-pattern-face opacity-60"></div>
										</div>
										<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-black spider-symbol"></div>
									</div>
								</div>
								<div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
									<div className="w-1 h-16 bg-black web-line-comic"></div>
								</div>
							</div>
						</div>

						<div className="mb-8 flex justify-center">
							<div className="comic-photo-frame bg-white border-4 border-black p-4 transform -rotate-1 shadow-lg">
								<div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gray-100 border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden">
									{currentPageData.image ? (
										<img
											src={currentPageData.image}
											alt={`Foto viñeta ${currentPage + 1}`}
											className="object-cover w-full h-full rounded-md"
										/>
									) : (
										<div className="text-center text-gray-600">
											<div className="text-4xl mb-2">📸</div>
											<p className="text-sm font-bold">FOTO AQUÍ</p>
											<p className="text-xs">VIÑETA {currentPage + 1}</p>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="text-center mb-8">
							<div className="comic-text-box bg-yellow-100 border-4 border-black p-3 sm:p-6 transform rotate-1 shadow-lg mb-6">
								<h2 className="text-2xl md:text-3xl font-black text-black mb-4 comic-font uppercase tracking-wide">
									{currentPageData.title}
								</h2>
							</div>
							<div className="comic-narrative-box bg-white border-4 border-black p-3 sm:p-6 shadow-lg">
								{revealConfession ? (
									<>
										<div
											className={`font-bold leading-relaxed ${
												currentPageData.isConfession
													? `text-4xl md:text-6xl ${passedQuiz ? "text-red-600" : "text-black"} comic-font uppercase tracking-wider`
													: "text-lg md:text-xl text-white"
											}`}
										>
											{currentPageData.isConfession ? confessionText : currentPageData.message}
										</div>
										{showWordSearchCta && !currentPageData.isConfession && (
											<div className="mt-6">
												<Link href={`/pupiletra${returnQuery}`}>
													<Button
														size="lg"
														className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105"
													>
														Juega aquí 💛
													</Button>
												</Link>
											</div>
										)}
										{showPuzzleCta && !currentPageData.isConfession && (
											<div className="mt-4">
												<Link href={`/rompecabezas${returnQuery}`}>
													<Button
														size="lg"
														className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105"
													>
														Juega aqui Preciosa 💖
													</Button>
												</Link>
											</div>
										)}
										{gameLink && !currentPageData.isConfession && (
											<div className="mt-4">
												<Link href={`${gameLink.href}${returnQuery}`}>
													<Button
														size="lg"
														className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105"
													>
														{gameLink.label}
													</Button>
												</Link>
											</div>
										)}
										{currentPageData.isConfession && (
											<div className="mt-4 text-lg font-black text-black comic-font">
												Resultado final: {quizPercentage}%
											</div>
										)}
									</>
								) : (
									<div className="text-center">
										<p className="text-lg sm:text-xl font-black text-black mb-2 comic-font">
											Mini-juego: responde para desbloquear la revelación
										</p>
										<p className="text-sm font-bold text-black mb-1">
											Pregunta {quizIndex + 1} de {totalQuestions}
										</p>
										<p className="text-xs font-black text-black mb-4">
											Puntaje: {quizScore}/{totalQuestions}
										</p>
										<div className="bg-yellow-100 border-4 border-black p-3 sm:p-4 shadow-lg mb-4">
											<p className="text-black font-black text-lg comic-font">
												{currentQuestion?.question}
											</p>
										</div>
										<div className="grid gap-3">
											{currentQuestion?.options.map((option, optionIndex) => {
												const isSelected = selectedAnswer === optionIndex
												const isCorrect = optionIndex === currentQuestion.correctIndex
												const showCorrect = selectedAnswer !== null && isCorrect
												const showIncorrect = selectedAnswer !== null && isSelected && !isCorrect
												return (
													<button
														key={option}
														onClick={() => handleAnswer(optionIndex)}
														disabled={selectedAnswer !== null}
														className={`w-full border-4 border-black font-black px-4 py-3 comic-font transition-transform transform hover:scale-105 ${
															showCorrect
																? "bg-green-300"
																: showIncorrect
																? "bg-red-300"
																: "bg-white"
														}`}
													>
														{option}
													</button>
												)
											})}
										</div>
										{selectedAnswer !== null && (
											<div className="mt-4">
												<div
													className={`border-4 border-black px-4 py-2 font-black comic-font ${
														answerFeedback === "correct"
															? "bg-green-200 text-black"
															: "bg-red-200 text-black"
													}`}
												>
													{answerFeedback === "correct"
														? `¡Correcto! Progreso: ${Math.round(((quizScore + 1) / totalQuestions) * 100)}%`
														: `Ups, casi. Progreso: ${Math.round((quizScore / totalQuestions) * 100)}%`}
												</div>
												<Button
													onClick={nextQuestion}
													size="lg"
													className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105 mt-3"
												>
													{quizIndex < totalQuestions - 1
														? "Siguiente pregunta"
														: "Ver la revelación"}
												</Button>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="relative max-w-md mx-auto mb-8">
							<div className="comic-speech-bubble bg-white border-4 border-black p-3 sm:p-6 relative shadow-xl transform -rotate-1">
								<div className="absolute -top-4 left-12 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-black"></div>
								<div className="absolute -top-3 left-12 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[16px] border-b-white"></div>
								<div className="text-center">
									<div className="text-red-600 font-black text-sm mb-2 tracking-widest uppercase">
										🕷️ SPIDER-MAN:
									</div>
									<p className="text-black font-bold text-lg leading-tight comic-font">
										"{currentPageData.spiderText}"
									</p>
								</div>
								<div className="absolute -top-1 -right-1 comic-emphasis-lines"></div>
							</div>
						</div>

						{currentPageData.isConfession && revealConfession && (
							<div className="text-center">
								<div className="comic-explosion bg-yellow-300 border-4 border-black p-2 sm:p-4 transform rotate-3 shadow-lg inline-block">
									<div className="flex items-center gap-2 text-2xl">
										<Heart className="w-8 h-8 text-red-600 fill-current" />
										<span className="font-black text-red-600 comic-font">
											¡BOOM!
										</span>
										<Heart className="w-8 h-8 text-red-600 fill-current" />
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
					<Button
						onClick={prevPage}
						disabled={currentPage === 0}
						variant="outline"
						size="lg"
						className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105"
					>
						<ChevronLeft className="w-4 h-4" />
						ANTERIOR
					</Button>
					<div className="flex gap-2">
						{pages.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentPage(index)}
								className={`w-4 h-4 border-2 border-black transition-colors transform hover:scale-110 ${
									index === currentPage ? "bg-red-600" : "bg-white"
								}`}
							/>
						))}
					</div>
					<Button
						onClick={nextPage}
						disabled={currentPage === pages.length - 1}
						size="lg"
						className="comic-button bg-red-300 border-4 border-red-900 font-black text-white hover:bg-red-400 transform hover:scale-105"
					>
						SIGUIENTE
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>

				<div className="text-center mt-12">
					<div className="comic-footer bg-black text-white p-2 sm:p-4 transform rotate-1 shadow-lg inline-block">
						<p className="font-black text-sm tracking-wider">
							¡CON AMOR Y TELARAÑAS! 🕸️ ❤️
						</p>
					</div>
					
				</div>
			</div>
		</div>
	)
}

export default function SpiderManLoveStory() {
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
			<SpiderManLoveStoryContent />
		</Suspense>
	)
}
