'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function DonationSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="w-full flex justify-center py-0 px-4 max-w-md text-center rounded-2xl relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl float-animation" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg float-animation"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl float-animation"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="mt-0 flex flex-col p-6 max-w-md">
        {/* Botão Pix */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-64 gradient-animate rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-medium py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base"
        >
          Apoie este projeto 💖
        </button>
      </div>

      {/* Modal Pix */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 sm:mx-0 text-center relative animate-scaleIn">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-gray-800">Chave Pix</h3>
            <p className="text-gray-600 mt-1">
              Escaneie o QR Code ou copie a chave abaixo:
            </p>

            {/* QR code placeholder - substitua pela imagem real */}
            <div className="mx-auto my-4 w-40 h-40 border rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Code Pix</span>
            </div>

            {/* Chave Pix */}
            <div className="bg-gray-100 p-2 rounded-lg text-sm font-mono break-all">
              anaclimgo@gmail.com
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
