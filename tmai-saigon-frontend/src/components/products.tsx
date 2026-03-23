"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const Products = () => {
  const [investmentProducts, setInvestmentProducts] = useState<
    { url: string; alt: string; description: string; link: string }[]
  >([])
  const [bookProducts, setBookProducts] = useState<{ url: string; alt: string; description: string; link: string }[]>(
    [],
  )
  const [webProducts, setWebProducts] = useState<{ url: string; alt: string; description: string; link: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [invResponse, bookResponse, webResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/products-investment`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/products-book`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/products-web`),
        ])
        if (!invResponse.ok || !bookResponse.ok || !webResponse.ok) throw new Error("Failed to fetch products")
        const invData = await invResponse.json()
        const bookData = await bookResponse.json()
        const webData = await webResponse.json()
        setInvestmentProducts(invData)
        setBookProducts(bookData)
        setWebProducts(webData)
        setLoading(false)
      } catch (err) {
        setError("Error loading products")
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto mt-16 px-4">
      <div id="sanpham">
        <h1 className="text-4xl font-bold text-center mb-8">SẢN PHẨM ĐẦU TƯ</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {investmentProducts.map((product, index) => (
            <Link key={index} href={product.link || "#"} className="relative group overflow-hidden rounded-lg">
              <Image
                src={product.url || "/placeholder.svg"}
                alt={product.alt}
                width={300}
                height={200}
                className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div id="sanpham" className="mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">SẢN PHẨM SÁCH</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bookProducts.map((product, index) => (
            <Link key={index} href={product.link || "#"} className="relative group overflow-hidden rounded-lg">
              <Image
                src={product.url || "/placeholder.svg"}
                alt={product.alt}
                width={300}
                height={200}
                className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div id="sanpham" className="mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">SẢN PHẨM WEB</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {webProducts.map((product, index) => (
            <Link key={index} href={product.link || "#"} className="relative group overflow-hidden rounded-lg">
              <Image
                src={product.url || "/placeholder.svg"}
                alt={product.alt}
                width={300}
                height={200}
                className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
