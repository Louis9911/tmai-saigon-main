"use client"
import logo from "../logo_tmaisaigon.ico"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="bg-gradient-to-r from-[#00d7ff] to-[#5800ff]  text-center text-white font-normal  ">
    <div className="container mx-auto px-4">
    <div className="flex justify-between items-center py-2">
        <a href="#home">
          <Image src="/logo_tmaisaigon.ico" alt="Logo" width={150} height={150} className="object-contain"/>
        </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div
            className={`fixed top-0 right-0 h-full bg-white md:bg-transparent transform transition-transform duration-300 w-2/3 md:w-auto z-50 ${isOpen ? "translate-x-0" : "translate-x-full"} md:static md:translate-x-0 md:flex md:items-center md:space-x-6`}
          >
            <nav className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 p-6 md:p-0 text-black md:text-white">
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 text-gray-700 md:hidden"
                aria-label="Close menu"
              >
                ✖
              </button>
              <a className="hover:text-gray-300" href="#gioithieu">
                Giới thiệu
              </a>
              <a className="hover:text-gray-300" href="#hoptac">
                Hợp tác
              </a>
              <a className="hover:text-gray-300" href="#sanpham">
                Sản phẩm
              </a>
              <a className="hover:text-gray-300" href="#sukien">
                Kết nối kinh doanh
              </a>
              <a className="hover:text-gray-300" href="#hoatdong">
                Hoạt động
              </a>
              <a className="hover:text-gray-300" href="#lienhe">
                Liên hệ
              </a>
            </nav>
            <Link  href="/admin" className="bg-gradient-to-r from-[#a076f9] to-[#6528f7] text-white px-4 py-2 rounded-full border border-gray-400 ms-10">
                Admin Panel
              </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
