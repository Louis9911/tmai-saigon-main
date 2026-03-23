"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

const Activities: React.FC = () => {
  const [domesticImages, setDomesticImages] = useState<{ url: string; alt: string }[]>([])
  const [internationalImages, setInternationalImages] = useState<{ url: string; alt: string; description: string }[]>(
    [],
  )
  const [domesticIndex, setDomesticIndex] = useState(0)
  const [isDomesticHovered, setIsDomesticHovered] = useState(false)
  const [internationalIndex, setInternationalIndex] = useState(0)
  const [isInternationalHovered, setIsInternationalHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [domResponse, intResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/activities-domestic`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/activities-international`),
        ])
        if (!domResponse.ok || !intResponse.ok) throw new Error("Failed to fetch activities")
        const domData = await domResponse.json()
        const intData = await intResponse.json()
        setDomesticImages(domData)
        setInternationalImages(intData)
        setLoading(false)
      } catch (err) {
        setError("Error loading activities")
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  const prevDomesticSlide = () => {
    setDomesticIndex((prevIndex) => (prevIndex === 0 ? domesticImages.length - 1 : prevIndex - 1))
  }

  const nextDomesticSlide = () => {
    setDomesticIndex((prevIndex) => (prevIndex === domesticImages.length - 1 ? 0 : prevIndex + 1))
  }

  const prevInternationalSlide = () => {
    setInternationalIndex((prevIndex) => (prevIndex === 0 ? internationalImages.length - 1 : prevIndex - 1))
  }

  const nextInternationalSlide = () => {
    setInternationalIndex((prevIndex) => (prevIndex === internationalImages.length - 1 ? 0 : prevIndex + 1))
  }

  useEffect(() => {
    if (isDomesticHovered || domesticImages.length === 0) return
    const interval = setInterval(nextDomesticSlide, 3000)
    return () => clearInterval(interval)
  }, [domesticIndex, isDomesticHovered, domesticImages.length])

  useEffect(() => {
    if (isInternationalHovered || internationalImages.length === 0) return
    const interval = setInterval(nextInternationalSlide, 3000)
    return () => clearInterval(interval)
  }, [internationalIndex, isInternationalHovered, internationalImages.length])

  const handleDomesticThumbnailClick = (index: number) => {
    setDomesticIndex(index)
  }

  const handleInternationalThumbnailClick = (index: number) => {
    setInternationalIndex(index)
  }

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div id="hoatdong" className="container mx-auto mt-16">
      <h1 className="font-bold text-4xl text-center mb-8">HOẠT ĐỘNG TRONG NƯỚC</h1>
      <section
        className="relative"
        onMouseEnter={() => setIsDomesticHovered(true)}
        onMouseLeave={() => setIsDomesticHovered(false)}
      >
        <div className="overflow-hidden rounded-lg shadow-lg bg-gray-400">
          <div className="relative w-full max-w-[800px] h-[300px] md:h-[500px] mx-auto overflow-hidden rounded-lg shadow-lg bg-black flex items-center justify-center">
            {domesticImages.map((image, index) => (
              <Image
                key={index}
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                width={800}
                height={500}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === domesticIndex ? "opacity-100" : "opacity-0"
                } object-contain w-full h-full`}
              />
            ))}
          </div>
        </div>
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
          onClick={prevDomesticSlide}
          aria-label="Previous slide"
        >
          ◀
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
          onClick={nextDomesticSlide}
          aria-label="Next slide"
        >
          ▶
        </button>
      </section>
      <div className="mt-4 flex overflow-x-auto space-x-2 p-2 bg-gray-800 rounded-lg">
        {domesticImages.map((image, index) => (
          <div
            key={index}
            className={`w-24 h-16 flex-shrink-0 cursor-pointer border-2 ${
              domesticIndex === index ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => handleDomesticThumbnailClick(index)}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              width={96}
              height={54}
              className="w-full h-full object-cover rounded hover:scale-105 hover:border-gray-500"
            />
          </div>
        ))}
      </div>

      <h1 className="font-bold text-4xl text-center mt-16 mb-8">HOẠT ĐỘNG QUỐC TẾ</h1>
      <section
        className="relative"
        onMouseEnter={() => setIsInternationalHovered(true)}
        onMouseLeave={() => setIsInternationalHovered(false)}
      >
        <div className="overflow-hidden rounded-lg shadow-lg bg-gray-400">
          <div className="relative w-full max-w-[800px] h-[300px] md:h-[500px] mx-auto overflow-hidden rounded-lg shadow-lg bg-black flex items-center justify-center">
            {internationalImages.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === internationalIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.alt}
                  width={800}
                  height={500}
                  className="object-contain w-full h-full"
                />
                {index === internationalIndex && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white p-2 rounded">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
          onClick={prevInternationalSlide}
          aria-label="Previous slide"
        >
          ◀
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
          onClick={nextInternationalSlide}
          aria-label="Next slide"
        >
          ▶
        </button>
      </section>
      <div className="mt-4 flex overflow-x-auto space-x-2 p-2 bg-gray-800 rounded-lg">
        {internationalImages.map((item, index) => (
          <div
            key={index}
            className={`w-24 h-16 flex-shrink-0 cursor-pointer border-2 ${
              internationalIndex === index ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => handleInternationalThumbnailClick(index)}
          >
            <Image
              src={item.url || "/placeholder.svg"}
              alt={item.alt}
              width={96}
              height={54}
              className="w-full h-full object-cover rounded hover:scale-105 hover:border-gray-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activities
