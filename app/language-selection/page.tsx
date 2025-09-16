"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import { type Language, languages } from "@/lib/i18n"

export default function LanguageSelectionPage() {
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)

  const handleContinue = () => {
    setLanguage(selectedLanguage)
    router.push("/dashboard/farmer")
  }

  const languageOptions: { code: Language; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Language</h1>
          <p className="text-gray-600">Select your preferred language for the best experience</p>
        </div>

        {/* Language Options */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Available Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languageOptions.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedLanguage === lang.code
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{lang.nativeName}</div>
                      <div className="text-sm text-gray-500">{lang.name}</div>
                    </div>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button
                onClick={handleContinue}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-lg"
              >
                Continue to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
