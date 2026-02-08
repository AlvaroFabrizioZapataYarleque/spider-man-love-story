"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"


type AudioContextValue = {
	isPlaying: boolean
	toggle: () => void
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)

	useEffect(() => {
		if (typeof window === "undefined") return
		const existing = (window as { __spiderAudio?: HTMLAudioElement }).__spiderAudio
		const audio = existing ?? new Audio("/sunflower-spiderman.mp3")
		if (!existing) {
			audio.loop = true
			audio.volume = 0.3
			;(window as { __spiderAudio?: HTMLAudioElement }).__spiderAudio = audio
		}
		audioRef.current = audio

		const updatePlaying = () => setIsPlaying(!audio.paused)
		audio.addEventListener("play", updatePlaying)
		audio.addEventListener("pause", updatePlaying)
		updatePlaying()

		if (audio.paused) {
			audio.play().catch(() => setIsPlaying(false))
		}

		return () => {
			audio.removeEventListener("play", updatePlaying)
			audio.removeEventListener("pause", updatePlaying)
		}
	}, [])

	const toggle = useCallback(async () => {
		if (!audioRef.current) return
		if (isPlaying) {
			audioRef.current.pause()
			setIsPlaying(false)
			return
		}
		try {
			await audioRef.current.play()
			setIsPlaying(true)
		} catch {
			setIsPlaying(false)
		}
	}, [isPlaying])

	return (
		<AudioContext.Provider value={{ isPlaying, toggle }}>
			{children}
		</AudioContext.Provider>
	)
}

export function useAudio() {
	const ctx = useContext(AudioContext)
	if (!ctx) {
		throw new Error("useAudio must be used within AudioProvider")
	}
	return ctx
}
