"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SmoothTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function SmoothTransition({ children, className = "" }: SmoothTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Animate in after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const transitionClass = `transition-all duration-1000 ${
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
  } ${className}`

  return (
    <div className={transitionClass}>
      {children}
    </div>
  )
}

// Hook for smooth navigation
export function useSmoothNavigation() {
  const router = useRouter()

  const navigateTo = (path: string, delay: number = 300) => {
    // Add a slight delay for smooth transition
    setTimeout(() => {
      router.push(path)
    }, delay)
  }

  return { navigateTo }
}
