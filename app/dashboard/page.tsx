'use client'

import { useEffect } from 'react'
import EnhancedDashboard from '@/components/dashboard/enhanced-dashboard'
import { useUser } from '@/lib/farmguard-store'
import { useLanguage } from '@/contexts/language-context'
import { appInitializer } from '@/lib/app-initialization'

export default function DashboardPage() {
  const { isAuthenticated } = useUser()
  const { language } = useLanguage()

  // Ensure app is initialized
  useEffect(() => {
    if (!appInitializer.getInitializationStatus()) {
      appInitializer.initialize()
    }
  }, [])

  // Track page views (example analytics)
  useEffect(() => {
    // Simple analytics tracking
    const trackPageView = () => {
      if (typeof window !== 'undefined') {
        console.log('📊 Dashboard page viewed')
        // Here you could implement actual analytics tracking
        // Example: analytics.trackPageView('/dashboard')
      }
    }

    trackPageView()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* App is guaranteed to be initialized by this point */}
      <main>
        <EnhancedDashboard />
      </main>
    </div>
  )
}