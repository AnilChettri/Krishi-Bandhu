"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/i18n"

export function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-green-600 rounded-md transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{languages[language]}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-20">
            <div className="py-1">
              {Object.entries(languages).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code as Language)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    language === code ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
