"use client"

import { Loader2, Sprout } from "lucide-react"

// General purpose loading spinner
export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
  )
}

// Full page loading for navigation
export function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Sprout className="h-8 w-8 text-green-600 animate-bounce" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading FarmGuard...</h2>
        <p className="text-gray-600">Getting your farming tools ready</p>
        <div className="mt-4">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  )
}

// Weather skeleton
export function WeatherSkeleton() {
  return (
    <div className="bg-blue-50 rounded-lg border p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-blue-200 rounded w-1/3"></div>
        <div className="h-8 bg-blue-200 rounded w-20"></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-2"></div>
            <div className="h-6 bg-blue-200 rounded mb-1"></div>
            <div className="h-4 bg-blue-200 rounded w-16 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Chat message loading
export function ChatLoadingMessage() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <Sprout className="h-4 w-4 text-green-600" />
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-[80%]">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-gray-600">AI is thinking...</span>
        </div>
      </div>
    </div>
  )
}

// Button loading state
export function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false,
  className = "",
  ...props 
}: {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  [key: string]: any
}) {
  return (
    <button
      className={`flex items-center justify-center gap-2 ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}

// Progress bar for multi-step processes
export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
