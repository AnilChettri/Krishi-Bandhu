"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Mouse, LogIn, Smartphone, ArrowRight } from "lucide-react"

export default function FarmerTutorial() {
  return (
    <div className="space-y-6">
      {/* Step 1: Language */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-800 mb-2">Step 1: Choose Your Language</h3>
              <p className="text-green-700 text-sm mb-3">
                First, select the language you are comfortable with. 
                <br />
                <span className="text-green-600">पहले अपनी सुविधाजनक भाषा चुनें।</span>
              </p>
              <div className="bg-white rounded-lg p-3 border-2 border-green-300">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Click on "English" button at top right</span>
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Sign In */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Step 2: Sign In to Start</h3>
              <p className="text-blue-700 text-sm mb-3">
                Click the green "Sign In" button to access farming tools.
                <br />
                <span className="text-blue-600">हरे रंग के "साइन इन" बटन पर क्लिक करें।</span>
              </p>
              <div className="bg-white rounded-lg p-3 border-2 border-blue-300">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <span>Sign In / साइन इन</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Mobile Friendly */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-800 mb-2">Works on Your Phone Too!</h3>
              <p className="text-purple-700 text-sm mb-3">
                This app works perfectly on your mobile phone.
                <br />
                <span className="text-purple-600">यह ऐप आपके मोबाइल फोन पर भी चलता है।</span>
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <Mouse className="h-4 w-4" />
                <span>Touch anywhere to navigate / कहीं भी स्पर्श करके नेविगेट करें</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
