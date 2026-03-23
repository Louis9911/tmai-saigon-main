"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const Cooperation = () => {
  const [brands, setBrands] = useState<{ url: string; alt: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/cooperation`)
        if (!response.ok) throw new Error("Failed to fetch brands")
        const data = await response.json()
        setBrands(data)
        setLoading(false)
      } catch (err) {
        setError("Error loading brands")
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div id="hoptac" className="container mx-auto mt-16">
      <h1 className="text-4xl font-bold text-center mb-6">HỢP TÁC</h1>
      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-scroll">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="w-full h-[100px] flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md transition-transform duration-300 hover:scale-110 hover:border-gray-500"
            >
              <Image
                src={brand.url || "/placeholder.svg"}
                alt={brand.alt}
                width={140}
                height={80}
                className="w-auto h-auto max-w-[120px] max-h-[80px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cooperation
