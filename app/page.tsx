"use client"

import { useState, useEffect } from "react"
import "./pancake.css"
import { useRouter } from "next/navigation"

export default function PancakeAnimation() {
  const router = useRouter();
  const [showText, setShowText] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 3500)
    const buttonTimer = setTimeout(() => setShowButton(true), 3500)
    return () => {
      clearTimeout(textTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-50 flex flex-col items-center justify-center overflow-hidden">
      <div className={`text-center mb-12 transition-all duration-2000 ease-out ${showText ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
        <h1 className="text-4xl font-bold text-amber-800 mb-2">Bonjour, I&apos;m Pancake!</h1>
        <p className="text-lg text-amber-600">Welcome to my website!</p>
      </div>

      <div className="loader">
        <div className="tall-stack">
          
          <div className="butter falling-element"></div>
          <div className="pancake falling-element pancake-1"></div>
          <div className="pancake falling-element pancake-2"></div>
          <div className="pancake falling-element pancake-3"></div>
          <div className="pancake falling-element pancake-4"></div>
          <div className="pancake falling-element pancake-5"></div>
          <div className="pancake falling-element pancake-6"></div>
          <div className="plate">
            <div className="plate-bottom"></div>
            <div className="shadow"></div>
          </div>
        </div>
      </div>

      <div className={`mt-8 transition-all duration-1500 ease-out ${showButton ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}>
        <button
          onClick={() => router.push("/cafe")}
          className="group relative overflow-hidden bg-orange-100 text-amber-800 font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-600 ease-in-out"></div>
          <span className="flex items-center gap-2 relative z-10">
            Welcome
            <svg className="w-4 h-4 transition-transform group-hover:animate-[bounce-x_0.8s_ease_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}
