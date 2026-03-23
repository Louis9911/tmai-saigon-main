"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const Events = () => {
  const [internationalEvents, setInternationalEvents] = useState<
    { url: string; alt: string; description: string; link: string }[]
  >([])
  const [businessEvents, setBusinessEvents] = useState<
    { url: string; alt: string; description: string; link: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [intResponse, bizResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/events-international`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/events-business`),
        ])
        if (!intResponse.ok || !bizResponse.ok) throw new Error("Failed to fetch events")
        const intData = await intResponse.json()
        const bizData = await bizResponse.json()
        setInternationalEvents(intData)
        setBusinessEvents(bizData)
        setLoading(false)
      } catch (err) {
        setError("Error loading events")
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto mt-16">
      <div id="sukien">
        <h1 className="text-4xl font-bold text-center mb-8">SỰ KIỆN QUỐC TẾ</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {internationalEvents.map((event, index) => (
            <div key={index} className="flex flex-col items-center">
              <Link href={event.link || "#"} target="_blank" rel="noopener noreferrer">
                <Image
                  src={event.url || "/placeholder.svg"}
                  alt={event.alt}
                  width={300}
                  height={200}
                  className="rounded-xl border border-gray-300 transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <Link href={event.link || "#"} target="_blank" rel="noopener noreferrer">
                <p className="mt-2 text-[#313866] text-center font-semibold transition-all duration-300 hover:text-red-500">
                  {event.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div id="sukien" className="mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">SỰ KIỆN KẾT NỐI KINH DOANH</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {businessEvents.map((event, index) => (
            <div key={index} className="flex flex-col items-center">
              <Link href={event.link || "#"} target="_blank" rel="noopener noreferrer">
                <Image
                  src={event.url || "/placeholder.svg"}
                  alt={event.alt}
                  width={300}
                  height={200}
                  className="rounded-xl border border-gray-300 transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <Link href={event.link || "#"} target="_blank" rel="noopener noreferrer">
                <p className="mt-2 text-[#313866] text-center font-semibold transition-all duration-300 hover:text-red-500">
                  {event.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Events
