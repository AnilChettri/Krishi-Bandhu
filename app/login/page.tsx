"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sprout, ArrowLeft, HelpCircle, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { VisualPointer } from "@/components/visual-guide"
import { LoadingButton } from "@/components/loading"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store user session
      if (typeof window !== 'undefined') {
        localStorage.setItem('user-logged-in', 'true')
        localStorage.setItem('user-email', email)
        localStorage.setItem('user-logged-in-before', 'true')
      }
      
      // Show success state briefly
      setShowSuccess(true)
      
      // Navigate to dashboard after brief delay
      setTimeout(() => {
        router.push("/dashboard/farmer")
      }, 1000)
      
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      // In a real app, show error message
    }
  }
  
  const isFirstTime = typeof window !== 'undefined' ? !localStorage.getItem('user-logged-in-before') : true

  const handleGoogleLogin = () => {
    // Simulate Google login
    router.push("/dashboard/farmer")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-500">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Sprout className="h-6 w-6" />
            <span className="font-semibold">Krishi Bandhu</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('welcome')}</h1>
            <p className="text-gray-600">{t('signInToContinue')}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors"
                required
                disabled={loading}
              />
            </div>

            {/* Sign In Button */}
            <div className="relative">
              <LoadingButton 
                type="submit" 
                loading={loading}
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50 transition-all duration-200"
              >
                {showSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Success! Redirecting...
                  </>
                ) : (
                  t('signIn')
                )}
              </LoadingButton>
              <VisualPointer 
                text="Enter details and click here / विवरण भरें और यहाँ क्लिक करें" 
                position="top"
                className="left-1/2 transform -translate-x-1/2"
                show={isFirstTime && !loading}
              />
            </div>

            {/* Footer Links */}
            <div className="flex items-center justify-center text-sm pt-4">
              <span className="text-gray-600">{t('needAccount')} </span>
              <Link href="/auth/farmer/signup" className="ml-1 text-green-600 hover:text-green-700 font-medium">
                {t('signUp')}
              </Link>
            </div>
          </form>
        </div>
      </main>
      
      {/* Help Button */}
      <Button
        onClick={() => window.history.back()}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-30 flex items-center justify-center"
        title="Need help? Go back to homepage"
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}
