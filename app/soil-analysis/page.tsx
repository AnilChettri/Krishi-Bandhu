"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TestTube, ArrowLeft, Calculator, Droplets, Zap, Leaf } from "lucide-react"
import Link from "next/link"

interface SoilData {
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  organicMatter: number
  moisture: number
}

export default function SoilAnalysisPage() {
  const [soilData, setSoilData] = useState<SoilData>({
    ph: 6.5,
    nitrogen: 45,
    phosphorus: 25,
    potassium: 180,
    organicMatter: 2.8,
    moisture: 22,
  })
  const [selectedCrop, setSelectedCrop] = useState("wheat")

  const getSoilStatus = (value: number, optimal: [number, number]) => {
    if (value < optimal[0]) return { status: "low", color: "text-red-600 bg-red-100" }
    if (value > optimal[1]) return { status: "high", color: "text-orange-600 bg-orange-100" }
    return { status: "optimal", color: "text-green-600 bg-green-100" }
  }

  const cropRequirements = {
    wheat: {
      ph: [6.0, 7.5] as [number, number],
      nitrogen: [40, 60] as [number, number],
      phosphorus: [20, 40] as [number, number],
      potassium: [150, 250] as [number, number],
    },
    rice: {
      ph: [5.5, 6.5] as [number, number],
      nitrogen: [50, 80] as [number, number],
      phosphorus: [15, 30] as [number, number],
      potassium: [100, 200] as [number, number],
    },
    cotton: {
      ph: [5.8, 8.0] as [number, number],
      nitrogen: [60, 100] as [number, number],
      phosphorus: [25, 50] as [number, number],
      potassium: [200, 400] as [number, number],
    },
  }

  const currentRequirements = cropRequirements[selectedCrop as keyof typeof cropRequirements]

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
              <TestTube className="h-6 w-6" />
              <h1 className="text-xl font-bold">Soil Analysis</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Soil Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Soil Test Results
              </CardTitle>
              <CardDescription>Enter your soil test values or use manual testing methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ph">pH Level</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    value={soilData.ph}
                    onChange={(e) => setSoilData({ ...soilData, ph: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moisture">Moisture (%)</Label>
                  <Input
                    id="moisture"
                    type="number"
                    value={soilData.moisture}
                    onChange={(e) => setSoilData({ ...soilData, moisture: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  value={soilData.nitrogen}
                  onChange={(e) => setSoilData({ ...soilData, nitrogen: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phosphorus">Phosphorus (kg/ha)</Label>
                  <Input
                    id="phosphorus"
                    type="number"
                    value={soilData.phosphorus}
                    onChange={(e) => setSoilData({ ...soilData, phosphorus: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (kg/ha)</Label>
                  <Input
                    id="potassium"
                    type="number"
                    value={soilData.potassium}
                    onChange={(e) => setSoilData({ ...soilData, potassium: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organic">Organic Matter (%)</Label>
                <Input
                  id="organic"
                  type="number"
                  step="0.1"
                  value={soilData.organicMatter}
                  onChange={(e) => setSoilData({ ...soilData, organicMatter: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crop">Target Crop</Label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Soil Analysis Report
              </CardTitle>
              <CardDescription>Recommendations for {selectedCrop} cultivation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* pH Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">pH Level</div>
                  <div className="text-sm text-muted-foreground">Current: {soilData.ph}</div>
                </div>
                <Badge className={getSoilStatus(soilData.ph, currentRequirements.ph).color} variant="outline">
                  {getSoilStatus(soilData.ph, currentRequirements.ph).status}
                </Badge>
              </div>

              {/* Nitrogen Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    Nitrogen
                  </div>
                  <div className="text-sm text-muted-foreground">{soilData.nitrogen} kg/ha</div>
                </div>
                <Badge
                  className={getSoilStatus(soilData.nitrogen, currentRequirements.nitrogen).color}
                  variant="outline"
                >
                  {getSoilStatus(soilData.nitrogen, currentRequirements.nitrogen).status}
                </Badge>
              </div>

              {/* Phosphorus Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    Phosphorus
                  </div>
                  <div className="text-sm text-muted-foreground">{soilData.phosphorus} kg/ha</div>
                </div>
                <Badge
                  className={getSoilStatus(soilData.phosphorus, currentRequirements.phosphorus).color}
                  variant="outline"
                >
                  {getSoilStatus(soilData.phosphorus, currentRequirements.phosphorus).status}
                </Badge>
              </div>

              {/* Potassium Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-purple-500" />
                    Potassium
                  </div>
                  <div className="text-sm text-muted-foreground">{soilData.potassium} kg/ha</div>
                </div>
                <Badge
                  className={getSoilStatus(soilData.potassium, currentRequirements.potassium).color}
                  variant="outline"
                >
                  {getSoilStatus(soilData.potassium, currentRequirements.potassium).status}
                </Badge>
              </div>

              {/* Moisture Analysis */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    Soil Moisture
                  </div>
                  <div className="text-sm text-muted-foreground">{soilData.moisture}%</div>
                </div>
                <Badge
                  className={soilData.moisture > 15 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}
                  variant="outline"
                >
                  {soilData.moisture > 15 ? "adequate" : "low"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Fertilizer Recommendations</CardTitle>
            <CardDescription>Based on your soil analysis and target crop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Nitrogen Recommendation */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Nitrogen (N)
                </h4>
                {soilData.nitrogen < currentRequirements.nitrogen[0] ? (
                  <div>
                    <p className="text-sm text-red-600 mb-2">Low nitrogen levels detected</p>
                    <p className="text-sm">
                      Apply: <strong>{currentRequirements.nitrogen[0] - soilData.nitrogen} kg/ha</strong> of nitrogen
                      fertilizer
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: Urea or Ammonium Sulfate</p>
                  </div>
                ) : (
                  <p className="text-sm text-green-600">Nitrogen levels are adequate</p>
                )}
              </div>

              {/* Phosphorus Recommendation */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  Phosphorus (P)
                </h4>
                {soilData.phosphorus < currentRequirements.phosphorus[0] ? (
                  <div>
                    <p className="text-sm text-red-600 mb-2">Low phosphorus levels</p>
                    <p className="text-sm">
                      Apply: <strong>{currentRequirements.phosphorus[0] - soilData.phosphorus} kg/ha</strong> of
                      phosphorus
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: DAP or SSP</p>
                  </div>
                ) : (
                  <p className="text-sm text-green-600">Phosphorus levels are adequate</p>
                )}
              </div>

              {/* Potassium Recommendation */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-purple-500" />
                  Potassium (K)
                </h4>
                {soilData.potassium < currentRequirements.potassium[0] ? (
                  <div>
                    <p className="text-sm text-red-600 mb-2">Low potassium levels</p>
                    <p className="text-sm">
                      Apply: <strong>{currentRequirements.potassium[0] - soilData.potassium} kg/ha</strong> of potassium
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: MOP or SOP</p>
                  </div>
                ) : (
                  <p className="text-sm text-green-600">Potassium levels are adequate</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Recommendations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>General Soil Health Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Soil Improvement:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Add organic compost to improve soil structure</li>
                  <li>• Practice crop rotation to maintain soil fertility</li>
                  <li>• Use cover crops during off-season</li>
                  <li>• Avoid over-tilling to preserve soil structure</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Monitoring:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Test soil pH every 6 months</li>
                  <li>• Monitor nutrient levels before each season</li>
                  <li>• Check soil moisture regularly</li>
                  <li>• Observe plant health indicators</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
