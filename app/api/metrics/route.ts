import { NextRequest, NextResponse } from 'next/server'
import { handleMetricsRequest, getMonitoringHealth } from '@/lib/monitoring'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Handle Prometheus metrics endpoint
    const { searchParams } = new URL(request.url)
    
    // Health check for monitoring
    if (searchParams.get('health') === 'true') {
      return NextResponse.json(getMonitoringHealth())
    }
    
    // Return Prometheus metrics
    const response = handleMetricsRequest(request)
    
    // Convert Response to NextResponse
    const metrics = await response.text()
    
    return new NextResponse(metrics, {
      status: response.status,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
    
  } catch (error) {
    console.error('❌ Metrics endpoint error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate metrics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Health check endpoint for monitoring systems
export async function HEAD() {
  try {
    const health = getMonitoringHealth()
    
    return new NextResponse(null, {
      status: health.enabled ? 200 : 503,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}
