'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

export default function DonationSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão Pix */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-medium py-3 px-4 text-sm"
      >
        Apoie este projeto 💖
      </button>

      {/* Modal Pix - Renderizado em portal */}
      {isOpen &&
        createPortal(
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

              <div className="mx-auto my-4 w-72 h-72 border rounded-lg bg-gray-100 flex items-center justify-center">
                <Image
                  src="/pix-qrcode.png"
                  alt="QR Code Pix"
                  width={400}
                  height={400}
                />
              </div>

              {/* Chave Pix */}
              <div className="bg-gray-100 p-2 rounded-lg text-sm font-mono break-all">
                anaclimgo@gmail.com
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
