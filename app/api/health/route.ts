import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'FarmGuard API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      weather: '/api/weather',
      market: '/api/market-info', 
      ai_assistant: '/api/ai-assistant',
      farm_suggestions: '/api/farm-suggestions'
    }
  })
}