'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/language-context'
import { X, ArrowLeft, ArrowRight, Play, Pause } from 'lucide-react'

interface TourStep {
  id: string
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  highlight?: boolean
  action?: string
}

interface EnhancedTourGuideProps {
  isOpen: boolean
  onClose: () => void
  steps: TourStep[]
  autoAdvance?: boolean
  autoAdvanceDelay?: number
}

const EnhancedTourGuide: React.FC<EnhancedTourGuideProps> = ({
  isOpen,
  onClose,
  steps,
  autoAdvance = false,
  autoAdvanceDelay = 5000
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoAdvance)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  // Find target element with retries
  const findTargetElement = useCallback((selector: string, retries = 5) => {
    const element = document.querySelector(selector) as HTMLElement
    
    if (element) {
      return element
    }
    
    if (retries > 0) {
      setTimeout(() => {
        const retryElement = findTargetElement(selector, retries - 1)
        if (retryElement) {
          setTargetElement(retryElement)
          updatePosition(retryElement)
        }
      }, 200)
    }
    
    return null
  }, [])

  // Update position based on target element
  const updatePosition = useCallback((element: HTMLElement) => {
    if (!element) return

    const rect = element.getBoundingClientRect()
    const step = steps[currentStep]
    
    let x = 0
    let y = 0

    switch (step.position) {
      case 'top':
        x = rect.left + rect.width / 2
        y = rect.top - 10
        break
      case 'bottom':
        x = rect.left + rect.width / 2
        y = rect.bottom + 10
        break
      case 'left':
        x = rect.left - 10
        y = rect.top + rect.height / 2
        break
      case 'right':
        x = rect.right + 10
        y = rect.top + rect.height / 2
        break
      case 'center':
      default:
        x = window.innerWidth / 2
        y = window.innerHeight / 2
        break
    }

    // Ensure tooltip stays within viewport
    const tooltipWidth = 320
    const tooltipHeight = 200
    
    x = Math.max(10, Math.min(x, window.innerWidth - tooltipWidth - 10))
    y = Math.max(10, Math.min(y, window.innerHeight - tooltipHeight - 10))

    setPosition({ x, y })
  }, [currentStep, steps])

  // Initialize tour step
  useEffect(() => {
    if (!isOpen || !steps[currentStep]) return

    const step = steps[currentStep]
    const element = findTargetElement(step.target)
    
    if (element) {
      setTargetElement(element)
      updatePosition(element)
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      })
      
      // Add highlight
      if (step.highlight) {
        element.classList.add('tour-highlight')
      }
      
      setIsVisible(true)
    } else {
      // If element not found, show tooltip in center
      setPosition({ x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 100 })
      setIsVisible(true)
    }

    return () => {
      // Cleanup highlight
      if (element && step.highlight) {
        element.classList.remove('tour-highlight')
      }
    }
  }, [currentStep, isOpen, steps, findTargetElement, updatePosition])

  // Auto advance logic
  useEffect(() => {
    if (!isPlaying || !isOpen) return

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        setIsPlaying(false)
        onClose()
      }
    }, autoAdvanceDelay)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, isOpen, steps.length, autoAdvanceDelay, onClose])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (targetElement) {
        updatePosition(targetElement)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [targetElement, updatePosition])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (!isOpen || !steps[currentStep] || !isVisible) {
    return null
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Tour Tooltip */}
      <Card
        className="absolute w-80 max-w-sm bg-white shadow-2xl border-2 border-blue-200 animate-in fade-in-0 duration-300"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translateX(-50%)'
        }}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <div className="flex items-center gap-2">
              {autoAdvance && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAutoPlay}
                  className="p-1 h-8 w-8"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 text-blue-800">
            {step.title}
          </h3>

          {/* Content */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {step.content}
          </p>

          {/* Action Hint */}
          {step.action && (
            <div className="mb-4 p-2 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Try this:</strong> {step.action}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <Button
                variant="default"
                size="sm"
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete
              </Button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS for tour highlight */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 9998;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5),
                      0 0 0 8px rgba(59, 130, 246, 0.2) !important;
          border-radius: 8px;
          animation: tour-pulse 2s infinite;
        }
        
        @keyframes tour-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.7), 0 0 0 12px rgba(59, 130, 246, 0.3); }
        }
      `}</style>
    </div>
  )
}

export default EnhancedTourGuide