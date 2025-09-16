"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Calculator, Sprout, BookOpen } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-muted rounded-full w-fit">
              <WifiOff className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">You're Offline</CardTitle>
            <CardDescription className="text-lg">
              No internet connection detected. Don't worry - you can still access essential farming tools!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Available Offline Features */}
            <div>
              <h3 className="font-semibold mb-4">Available Offline:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">Profit Calculator</div>
                    <div className="text-sm text-green-600">Calculate crop profits offline</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">Crop Guides</div>
                    <div className="text-sm text-green-600">Access farming guides</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">Pest Guide</div>
                    <div className="text-sm text-green-600">Identify common pests</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">Sowing Calendar</div>
                    <div className="text-sm text-green-600">Best sowing times</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unavailable Features */}
            <div>
              <h3 className="font-semibold mb-4">Requires Internet:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                  <WifiOff className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-600">Weather Forecast</div>
                    <div className="text-sm text-gray-500">Real-time weather data</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                  <WifiOff className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-600">Market Prices</div>
                    <div className="text-sm text-gray-500">Live crop prices</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                  <WifiOff className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-600">AI Assistant</div>
                    <div className="text-sm text-gray-500">Online AI chat</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                  <WifiOff className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-600">Pest Detection</div>
                    <div className="text-sm text-gray-500">AI image analysis</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => window.location.reload()} className="flex items-center gap-2" variant="default">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Link href="/dashboard/farmer" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Offline
                </Button>
              </Link>
            </div>

            {/* Sync Notice */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Auto-sync enabled:</strong> Your offline actions will be synced automatically when you're back
                online.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
