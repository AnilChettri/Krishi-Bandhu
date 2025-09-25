import { NextRequest, NextResponse } from 'next/server'
import { localStorageService } from '@/lib/local-storage'

interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  location?: {
    district: string
    tehsil?: string
    village?: string
    coordinates?: {
      lat: number
      lon: number
    }
  }
  farmDetails?: {
    totalLand: number
    crops: string[]
    soilType?: string
    irrigationType?: string
    farmingExperience: 'beginner' | 'intermediate' | 'experienced'
  }
  preferences?: {
    language: 'en' | 'pa' | 'hi'
    units: 'metric' | 'imperial'
    notifications: boolean
  }
  createdAt: string
  lastLoginAt: string
  isVerified: boolean
}

interface AuthRequest {
  action: 'signup' | 'signin' | 'verify' | 'update-profile'
  email: string
  password?: string
  name?: string
  phone?: string
  location?: UserProfile['location']
  farmDetails?: UserProfile['farmDetails']
  preferences?: UserProfile['preferences']
  verificationCode?: string
}

interface AuthResponse {
  success: boolean
  user?: UserProfile
  token?: string
  message?: string
  error?: string
}

// Mock user database (in production, use a real database)
const users = new Map<string, UserProfile>()

// Mock session storage
const sessions = new Map<string, { userId: string, expiresAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequest = await request.json()
    const { action, email, password, name, phone, location, farmDetails, preferences, verificationCode } = body

    console.log(`Auth API: ${action} request for ${email}`)

    switch (action) {
      case 'signup':
        return handleSignUp(email, password!, name!, phone, location, farmDetails, preferences)
      
      case 'signin':
        return handleSignIn(email, password!)
      
      case 'verify':
        return handleVerification(email, verificationCode!)
      
      case 'update-profile':
        return handleUpdateProfile(email, { name, phone, location, farmDetails, preferences })
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

async function handleSignUp(
  email: string, 
  password: string, 
  name: string, 
  phone?: string, 
  location?: UserProfile['location'],
  farmDetails?: UserProfile['farmDetails'],
  preferences?: UserProfile['preferences']
): Promise<NextResponse> {
  // Check if user already exists
  if (users.has(email)) {
    return NextResponse.json({
      success: false,
      error: 'User with this email already exists'
    }, { status: 409 })
  }

  // Create new user
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const newUser: UserProfile = {
    id: userId,
    email,
    name,
    phone,
    location,
    farmDetails,
    preferences: {
      language: preferences?.language || 'en',
      units: preferences?.units || 'metric',
      notifications: preferences?.notifications ?? true
    },
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isVerified: false // In production, send verification email
  }

  users.set(email, newUser)

  // Create session token
  const token = generateSessionToken(userId)
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  sessions.set(token, { userId, expiresAt })

  // Store user data locally (for development)
  try {
    localStorageService.setItem(`user_${email}`, JSON.stringify(newUser))
    localStorageService.setItem(`session_${token}`, JSON.stringify({ userId, expiresAt }))
  } catch (error) {
    console.warn('Failed to store user data locally:', error)
  }

  console.log(`✅ User created: ${email}`)

  return NextResponse.json({
    success: true,
    user: { ...newUser, password: undefined },
    token,
    message: 'Account created successfully! Please verify your phone number.'
  })
}

async function handleSignIn(email: string, password: string): Promise<NextResponse> {
  const user = users.get(email)
  
  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'Invalid email or password'
    }, { status: 401 })
  }

  // In production, verify password hash
  // For demo purposes, accept any password

  // Update last login
  user.lastLoginAt = new Date().toISOString()
  users.set(email, user)

  // Create session token
  const token = generateSessionToken(user.id)
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  sessions.set(token, { userId: user.id, expiresAt })

  console.log(`✅ User signed in: ${email}`)

  return NextResponse.json({
    success: true,
    user: { ...user, password: undefined },
    token,
    message: 'Signed in successfully!'
  })
}

async function handleVerification(email: string, verificationCode: string): Promise<NextResponse> {
  const user = users.get(email)
  
  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'User not found'
    }, { status: 404 })
  }

  // In production, verify the actual code
  // For demo, accept any 4-digit code
  if (verificationCode.length === 4) {
    user.isVerified = true
    users.set(email, user)

    return NextResponse.json({
      success: true,
      user: { ...user, password: undefined },
      message: 'Phone number verified successfully!'
    })
  }

  return NextResponse.json({
    success: false,
    error: 'Invalid verification code'
  }, { status: 400 })
}

async function handleUpdateProfile(
  email: string, 
  updates: Partial<Pick<UserProfile, 'name' | 'phone' | 'location' | 'farmDetails' | 'preferences'>>
): Promise<NextResponse> {
  const user = users.get(email)
  
  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'User not found'
    }, { status: 404 })
  }

  // Update user profile
  Object.assign(user, updates)
  users.set(email, user)

  console.log(`✅ Profile updated: ${email}`)

  return NextResponse.json({
    success: true,
    user: { ...user, password: undefined },
    message: 'Profile updated successfully!'
  })
}

function generateSessionToken(userId: string): string {
  return `farmguard_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
}

// GET endpoint for session validation
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token provided'
      }, { status: 401 })
    }

    const session = sessions.get(token)
    
    if (!session || Date.now() > session.expiresAt) {
      sessions.delete(token)
      return NextResponse.json({
        success: false,
        error: 'Session expired'
      }, { status: 401 })
    }

    // Find user by ID
    let user: UserProfile | undefined
    for (const [email, userData] of users.entries()) {
      if (userData.id === session.userId) {
        user = userData
        break
      }
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: { ...user, password: undefined },
      message: 'Session valid'
    })
  } catch (error) {
    console.error('Auth validation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 })
  }
}

// DELETE endpoint for logout
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (token) {
      sessions.delete(token)
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 })
  }
}