"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FarmGuardLayout from "@/components/farmguard-layout"
import { Calculator, Lightbulb, TrendingUp, Calendar, Sprout, Clock, DollarSign, BarChart3 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function FarmSuggestions() {
  const { t } = useLanguage()
  const [landSize, setLandSize] = useState("15")
  const [expectedYield, setExpectedYield] = useState("25")
  const [totalCost, setTotalCost] = useState("100")
  const [marketPrice, setMarketPrice] = useState("22")

  const calculateProfit = () => {
    const yield_amount = Number.parseFloat(landSize) * Number.parseFloat(expectedYield)
    const revenue = yield_amount * Number.parseFloat(marketPrice)
    const cost = Number.parseFloat(totalCost)
    const profit = revenue - cost
    const margin = ((profit / revenue) * 100).toFixed(0)
    return { profit, margin, totalYield: yield_amount }
  }

  const { profit, margin, totalYield } = calculateProfit()

  const recommendedCrops = [
    {
      name: "Basmati Rice",
      difficulty: "medium",
      description: "Grow premium Basmati rice for export market with high profit margins",
      sowingTime: "June 1 - July 15",
      expectedYield: "1200 kg/acre",
      marketPrice: "₹80/kg",
      profitMargin: "55%",
      icon: "🌾",
    },
    {
      name: "Pearl Millet",
      difficulty: "easy",
      description: "Climate-resilient pearl millet perfect for dry conditions",
      sowingTime: "June 15 - July 31",
      expectedYield: "1000 kg/acre",
      marketPrice: "₹35/kg",
      profitMargin: "40%",
      icon: "🌾",
    },
    {
      name: "Sugarcane",
      difficulty: "medium",
      description: "Reliable cash crop with guaranteed government procurement",
      sowingTime: "Feb 15 - Apr 30",
      expectedYield: "45000 kg/acre",
      marketPrice: "₹3.5/kg",
      profitMargin: "25%",
      icon: "🌾",
    },
    {
      name: "Wheat (HD-2967)",
      difficulty: "easy",
      description: "Plant HD-2967 wheat variety suitable for your soil type with excellent disease resistance",
      sowingTime: "Nov 15 - Dec 15",
      expectedYield: "1800 kg/acre",
      marketPrice: "₹25/kg",
      profitMargin: "35%",
      icon: "🌾",
    },
    {
      name: "Turmeric",
      difficulty: "medium",
      description: "High-demand organic turmeric with premium market pricing",
      sowingTime: "May 1 - June 30",
      expectedYield: "800 kg/acre",
      marketPrice: "₹120/kg",
      profitMargin: "65%",
      icon: "🌾",
    },
    {
      name: "Saffron",
      difficulty: "hard",
      description: "Luxury spice crop with exceptional profit potential",
      sowingTime: "Sep 1 - Oct 15",
      expectedYield: "12 kg/acre",
      marketPrice: "₹250000/kg",
      profitMargin: "80%",
      icon: "🌾",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <FarmGuardLayout>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-gray-800">
              <Lightbulb className="h-8 w-8 text-green-600" />
              {t('farmSuggestions')}
            </h1>
            <p className="text-gray-600">Personalized recommendations to maximize your farming success</p>
          </div>

          {/* Profitability Calculator */}
          <Card className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Calculator className="h-6 w-6" />
                {t('profitabilityCalculator')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Fields Row */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="landSize" className="text-white text-sm font-medium block mb-2">
                    {t('landSize')}
                  </Label>
                  <Input
                    id="landSize"
                    type="number"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="Enter acres"
                    className="bg-blue-400/30 border-blue-300/50 text-white placeholder:text-blue-100 focus:border-white focus:ring-white"
                  />
                </div>
                <div>
                  <Label htmlFor="yield" className="text-white text-sm font-medium block mb-2">
                    {t('expectedYield')}
                  </Label>
                  <Input
                    id="yield"
                    type="number"
                    value={expectedYield}
                    onChange={(e) => setExpectedYield(e.target.value)}
                    placeholder="Yield per acre"
                    className="bg-blue-400/30 border-blue-300/50 text-white placeholder:text-blue-100 focus:border-white focus:ring-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cost" className="text-white text-sm font-medium block mb-2">
                    {t('totalCosts')}
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    placeholder="Total investment"
                    className="bg-blue-400/30 border-blue-300/50 text-white placeholder:text-blue-100 focus:border-white focus:ring-white"
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-white text-sm font-medium block mb-2">
                    {t('marketPrice')}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(e.target.value)}
                    placeholder="Price per kg"
                    className="bg-blue-400/30 border-blue-300/50 text-white placeholder:text-blue-100 focus:border-white focus:ring-white"
                  />
                </div>
              </div>

              {/* Results Row */}
              <div className="grid grid-cols-3 gap-8 pt-6 border-t border-blue-400/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">₹{profit.toLocaleString()}</div>
                  <div className="text-blue-100 text-sm font-medium">{t('estimatedProfit')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{margin}%</div>
                  <div className="text-blue-100 text-sm font-medium">{t('profitMargin')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{totalYield} kg</div>
                  <div className="text-blue-100 text-sm font-medium">{t('totalYield')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-1">{t('bestSowingWindow')}</h3>
                <div className="text-2xl font-bold text-green-700 mb-1">Nov 15 - Dec 15</div>
                <p className="text-sm text-green-600">Optimal conditions for Rabi crops in your region</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-orange-800 mb-1">{t('harvestAlert')}</h3>
                <div className="text-2xl font-bold text-orange-700 mb-1">Mar 20 - Apr 10</div>
                <p className="text-sm text-orange-600">Expected harvest time for current crops</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-800 mb-1">{t('marketTrend')}</h3>
                <div className="text-2xl font-bold text-purple-700 mb-1">↑ 15%</div>
                <p className="text-sm text-purple-600">Wheat prices trending upward</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('recommendedCrops')}</h2>

            <div className="grid grid-cols-2 gap-6">
              {recommendedCrops.slice(0, 4).map((crop, index) => (
                <Card key={crop.name} className="bg-white hover:shadow-lg transition-shadow border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-lg text-gray-800">{crop.name}</h3>
                      </div>
                      <Badge className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(crop.difficulty)}`}>
                        {crop.difficulty}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">{crop.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{t('sowingTime')}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{crop.sowingTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Expected Yield</span>
                        </div>
                        <span className="font-semibold text-gray-800">{crop.expectedYield}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Market Price</span>
                        </div>
                        <span className="font-semibold text-gray-800">{crop.marketPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{t('profitMargin')}</span>
                        </div>
                        <span className="font-semibold text-green-600">{crop.profitMargin}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium">
                        {t('getAdvice')}
                      </Button>
                      <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                        {t('planCrop')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </FarmGuardLayout>
  )
}
