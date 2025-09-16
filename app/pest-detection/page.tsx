"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bug, Camera, Upload, ArrowLeft, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface DetectionResult {
  pest: string
  confidence: number
  severity: "low" | "medium" | "high"
  treatment: string
  prevention: string
}

export default function PestDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
      setResult(null)
      analyzeImage()
    }
  }

  const analyzeImage = () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: DetectionResult[] = [
        {
          pest: "Aphids",
          confidence: 92,
          severity: "medium",
          treatment: "Apply neem oil spray or insecticidal soap. Spray in early morning or evening.",
          prevention: "Encourage beneficial insects like ladybugs. Regular monitoring and proper plant spacing.",
        },
        {
          pest: "Leaf Blight",
          confidence: 87,
          severity: "high",
          treatment: "Remove affected leaves immediately. Apply copper-based fungicide every 7-10 days.",
          prevention: "Ensure proper drainage, avoid overhead watering, and maintain good air circulation.",
        },
        {
          pest: "Whitefly",
          confidence: 78,
          severity: "low",
          treatment: "Use yellow sticky traps. Apply neem oil or horticultural oil spray.",
          prevention: "Remove weeds around crops, use reflective mulch, and encourage natural predators.",
        },
      ]

      setResult(mockResults[Math.floor(Math.random() * mockResults.length)])
      setIsAnalyzing(false)
    }, 2000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-orange-600 bg-orange-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Bug className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/farmer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bug className="h-6 w-6" />
              <h1 className="text-xl font-bold">Pest & Disease Detection</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload Crop Image
              </CardTitle>
              <CardDescription>Take a clear photo of the affected plant or crop for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected crop"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedImage(null)
                        setResult(null)
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP (max 10MB)</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => fileInputRef.current?.click()} className="flex-1" disabled={isAnalyzing}>
                    <Camera className="h-4 w-4 mr-2" />
                    {selectedImage ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {selectedImage && !result && !isAnalyzing && (
                    <Button onClick={analyzeImage} variant="secondary">
                      Analyze
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>AI-powered pest and disease identification</CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">Analyzing image...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{result.pest}</h3>
                    <Badge className={getSeverityColor(result.severity)}>
                      {getSeverityIcon(result.severity)}
                      <span className="ml-1 capitalize">{result.severity}</span>
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">Confidence: {result.confidence}%</div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Treatment:</strong> {result.treatment}
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Prevention:</strong> {result.prevention}
                    </AlertDescription>
                  </Alert>

                  <Button className="w-full" onClick={() => setSelectedImage(null)}>
                    Analyze Another Image
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload an image to get started with pest detection</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Common Pests Guide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Common Pests & Diseases</CardTitle>
            <CardDescription>Quick reference guide for identification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Aphids</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Small, soft-bodied insects that cluster on leaves and stems
                </p>
                <Badge variant="outline" className="text-orange-600">
                  Medium Risk
                </Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Leaf Blight</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Brown or black spots on leaves, often with yellow halos
                </p>
                <Badge variant="outline" className="text-red-600">
                  High Risk
                </Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Whitefly</h4>
                <p className="text-sm text-muted-foreground mb-2">Tiny white flying insects found on leaf undersides</p>
                <Badge variant="outline" className="text-green-600">
                  Low Risk
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
