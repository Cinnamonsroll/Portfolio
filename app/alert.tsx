"use client"
import { useState } from "react"

export default function WarningBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 sm:hidden">
      <div className="relative bg-red-50 border border-red-400 text-red-800 rounded-xl shadow-md px-6 py-3 max-w-xs w-full">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-sm font-medium text-center">
          Use at your own risk. Designed for Desktop.
        </p>
      </div>
    </div>
  )
}
