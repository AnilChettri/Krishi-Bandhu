"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Smartphone, Monitor } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const beforeInstallPrompt = e as BeforeInstallPromptEvent
      setDeferredPrompt(beforeInstallPrompt)
      
      // Show install prompt after a delay (give user time to explore)
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 30000) // 30 seconds
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-install-dismissed', 'true')
    }
  }

  // Don't show if already dismissed this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-install-dismissed')) {
    return null
  }

  if (!showInstallPrompt) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Install Krishi Bandhu</h3>
              <p className="text-xs text-gray-600">Get app-like experience</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isIOS ? (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              To install: Tap <Monitor className="inline h-3 w-3" /> Share button, then "Add to Home Screen"
            </p>
            <Button onClick={handleDismiss} size="sm" className="w-full bg-green-600 hover:bg-green-700">
              Got it!
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              Install Krishi Bandhu on your phone for faster access and offline features
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm" className="flex-1">
                Later
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
