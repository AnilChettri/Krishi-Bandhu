"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sprout, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function FarmerSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate account creation
    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard/farmer")
    }, 1000)
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
            <span className="font-semibold">FarmGuard</span>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join FarmGuard to get started</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            {/* Sign Up Button */}
            <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium" disabled={loading}>
              {loading ? "Creating Account..." : t('signUp')}
            </Button>

            {/* Footer Links */}
            <div className="flex items-center justify-center text-sm pt-4">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="ml-1 text-green-600 hover:text-green-700 font-medium">
                {t('signIn')}
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
