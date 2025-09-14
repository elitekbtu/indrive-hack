"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  title?: string
  description?: string
  className?: string
}

export default function VideoPlayer({ 
  src, 
  title = "Демонстрация AI-анализа", 
  description = "Загрузка фото → AI обработка → Результат анализа",
  className = ""
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Принудительно устанавливаем muted для автовоспроизведения
      video.muted = true
      
      // Обработчики событий
      const handleLoadedData = () => {
        console.log('Video loaded successfully')
        setIsLoaded(true)
        setHasError(false)
      }
      
      const handleError = (e: any) => {
        console.error('Video error:', e)
        setHasError(true)
      }

      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('error', handleError)
      }
    }
  }, [])

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
        } else {
          await videoRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Error playing video:', error)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  // Если видео не загрузилось, показываем fallback
  if (hasError) {
    return (
      <div className={`relative group ${className}`}>
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
            <p className="text-red-400 text-sm mt-4">Видео временно недоступно</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-emerald-600">1.5s</div>
            <div className="text-sm text-gray-600">Время анализа</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-emerald-600">83.4%</div>
            <div className="text-sm text-gray-600">Точность AI</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-emerald-600">7</div>
            <div className="text-sm text-gray-600">Типов повреждений</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Video Container */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-700 shadow-2xl">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          style={{ cursor: 'pointer' }}
        >
          <source src={src} type="video/mp4" />
          <p>Ваш браузер не поддерживает воспроизведение видео.</p>
        </video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Play Button - показывается только когда видео на паузе */}
        {!isPlaying && isLoaded && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10" 
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110 flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          </div>
        )}

        {/* Ripple Effect */}
        {!isPlaying && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full border-2 border-white/30 animate-ping" />
            <div className="absolute w-32 h-32 rounded-full border border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-40 h-40 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '1s' }} />
          </div>
        )}

        {/* Bottom Text Overlay */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-white/90 text-sm md:text-base">
            {description}
          </p>
        </div>

        {/* Sound Control */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/30 hover:bg-black/40 flex items-center justify-center transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-2xl font-bold text-emerald-600">1.5s</div>
          <div className="text-sm text-gray-600">Время анализа</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-2xl font-bold text-emerald-600">83.4%</div>
          <div className="text-sm text-gray-600">Точность AI</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="text-2xl font-bold text-emerald-600">7</div>
          <div className="text-sm text-gray-600">Типов повреждений</div>
        </div>
      </div>
    </div>
  )
}