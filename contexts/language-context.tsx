"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, languages, getTranslation } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof import("@/lib/i18n").translations.en) => string
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("farmguard-language") as Language
    if (savedLanguage && savedLanguage in languages) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("farmguard-language", lang)
    // Update document language
    document.documentElement.lang = lang
  }

  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => {
    return getTranslation(language, key)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
