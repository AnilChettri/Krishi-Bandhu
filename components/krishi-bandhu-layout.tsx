"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CloudRain, Bot, Lightbulb, LogOut, Menu, X, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

interface KrishiBandhuLayoutProps {
  children: React.ReactNode
}

export default function KrishiBandhuLayout({ children }: KrishiBandhuLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<{ email: string; preferred_language?: string } | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      title: t("weatherAlerts"),
      url: "/weather",
      icon: CloudRain,
    },
    {
      title: t("aiAssistant"),
      url: "/ai-assistant",
      icon: Bot,
    },
    {
      title: t("farmSuggestions"),
      url: "/farm-suggestions",
      icon: Lightbulb,
    },
  ]

  useEffect(() => {
    const loadUser = async () => {
      try {
        // In a real app, this would fetch from your auth system
        const currentUser = { email: "farmer@example.com", preferred_language: "en" }
        setUser(currentUser)
      } catch (error) {
        console.log("User not logged in")
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    setUser(null)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-green-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard/farmer" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Krishi Bandhu</h1>
                <p className="text-xs text-green-100">Smart Farming Assistant</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.url
                      ? "bg-green-500 text-white"
                      : "text-green-100 hover:text-white hover:bg-green-500/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <LanguageSelector />

              {/* User Info & Logout */}
              {user && (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-green-100 text-sm font-medium">{user?.email}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    {t("logout")}
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-green-700 border-t border-green-500">
            <div className="px-4 py-3 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.url
                      ? "bg-green-500 text-white"
                      : "text-green-100 hover:text-white hover:bg-green-500/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              ))}
              {user && (
                <div className="pt-3 mt-3 border-t border-green-500">
                  <div className="text-green-100 text-sm mb-2 font-medium">{user?.email}</div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 w-full font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    {t("logout")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
