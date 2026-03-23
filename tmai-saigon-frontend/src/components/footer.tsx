"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  const [logos, setLogos] = useState<{ url: string; alt: string; link: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/footer-logos`)
        if (!response.ok) throw new Error("Failed to fetch logos")
        const data = await response.json()
        setLogos(data)
        setLoading(false)
      } catch (err) {
        setError("Error loading logos")
        setLoading(false)
      }
    }
    fetchLogos()
  }, [])

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <footer id="lienhe" className="mt-16 bg-gradient-to-r from-[#00d7ff] to-[#5800ff] w-full max-w-[100vw]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13483.254650491539!2d106.67993300382213!3d10.768839424952901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f07b3a24645%3A0x8190331668205de4!2zVMOyYSBuaMOgIEhNIFRvd24!5e0!3m2!1svi!2s!4v1717619133390!5m2!1svi!2s"
        className="w-full h-[50vh] border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="TMAI Saigon Location"
      />
      <div className="flex flex-col items-center text-center p-5">
        <p className="text-white text-sm mb-2">Công ty TNHH TMAI SÀI GÒN</p>
        <p className="text-white text-sm mb-2">Văn phòng: HM Town, 412 Nguyễn Thị Minh Khai, P. 5, Quận 3, TPHCM</p>
        <p className="text-white text-sm mb-2">Email: ngaymoisaigon@gmail.com; tmaisaigon@ngaymoisaigon.com</p>
        <p className="text-white text-sm mb-2">Website: ngaymoisaigon.com - ngaymoisaigon.vn</p>
        <p className="text-white text-sm mb-2">Điện thoại: 086.995.7420 - 0901.472.160</p>
        <div className="flex flex-col md:flex-row justify-center">
          {logos.map((logo, index) => (
            <Link key={index} href={logo.link || "#"}>
              <Image
                src={logo.url || "/placeholder.svg"}
                alt={logo.alt}
                width={100}
                height={100}
                className="p-2 hover:scale-110 transition-transform duration-300"
              />
            </Link>
          ))}
        </div>
        <p className="text-[#cacdd2] text-sm mt-2">Bản quyền thuộc về công ty TNHH TMAI Sài Gòn©2016</p>
      </div>
    </footer>
  )
}

export default Footer
