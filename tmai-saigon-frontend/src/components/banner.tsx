"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

const Banner: React.FC = () => {
  const [images, setImages] = useState<{ url: string; alt: string }[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/banner`)
        if (!response.ok) throw new Error("Failed to fetch images")
        const data = await response.json()
        setImages(data)
        setLoading(false)
      } catch (err) {
        setError("Error loading images")
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  useEffect(() => {
    if (isHovered || images.length === 0) return
    const interval = setInterval(nextSlide, 3000)
    return () => clearInterval(interval)
  }, [currentIndex, isHovered, images.length])

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>
  if (images.length === 0) return <div className="text-center">No images available</div>

  return (
    <section
      id="home"
      className="relative w-full max-w-3xl ms-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                width={800}
                height={500}
                className="w-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ❯
      </button>
    </section>
  )
}

export default Banner
