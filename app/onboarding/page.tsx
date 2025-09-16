"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Smartphone, Bot, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const onboardingSteps = [
  {
    icon: Sprout,
    title: "Welcome to FarmGuard",
    description:
      "Your smart farming companion that works in your language and helps you make better farming decisions.",
    content:
      "FarmGuard provides personalized crop advisory, weather alerts, and market insights to help increase your farm productivity and profits.",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description: "Access essential farming tools even without internet connection.",
    content:
      "Your profit calculator, crop guides, and farming tips are always available offline. When you're back online, everything syncs automatically.",
  },
  {
    icon: Bot,
    title: "AI Farming Assistant",
    description: "Get instant answers to your farming questions with voice, text, or photos.",
    content:
      "Ask questions in your language, take photos of pests or diseases, and get expert advice powered by AI technology.",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard/farmer")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = onboardingSteps[currentStep]
  const IconComponent = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="text-center">
          <CardHeader className="pb-8">
            <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-full w-fit">
              <IconComponent className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl mb-2">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{currentStepData.content}</p>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button onClick={handleNext} className="flex items-center gap-2">
                {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Skip Option */}
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/farmer")}
              className="text-sm text-muted-foreground"
            >
              Skip Tour
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
