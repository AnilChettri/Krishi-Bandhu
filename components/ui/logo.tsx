import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom'
  width?: number
  height?: number
  className?: string
  showText?: boolean
  textColor?: string
  priority?: boolean
}

const sizeMap = {
  xs: { width: 24, height: 24 },
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 56, height: 56 },
  xl: { width: 80, height: 80 },
  custom: { width: 0, height: 0 } // Will use provided width/height
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  width: customWidth,
  height: customHeight,
  className,
  showText = true,
  textColor = 'text-white',
  priority = false
}) => {
  const dimensions = size === 'custom' 
    ? { width: customWidth || 40, height: customHeight || 40 }
    : sizeMap[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        <Image
          src="/logo.png"
          alt="FarmGuard Logo"
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className="object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={cn('font-bold leading-tight', textColor, {
            'text-lg': size === 'xs' || size === 'sm',
            'text-xl': size === 'md',
            'text-2xl': size === 'lg',
            'text-3xl': size === 'xl',
          })}>
            FarmGuard
          </h1>
          <p className={cn('text-xs opacity-80 leading-tight', textColor)}>
            Smart Farming Assistant
          </p>
        </div>
      )}
    </div>
  )
}

// Compact version for navigation bars
export const LogoCompact: React.FC<Omit<LogoProps, 'showText'>> = (props) => (
  <Logo {...props} showText={false} />
)

// Different preset variations
export const LogoNavbar: React.FC<Omit<LogoProps, 'size' | 'showText'>> = (props) => (
  <Logo {...props} size="md" showText={true} />
)

export const LogoHero: React.FC<Omit<LogoProps, 'size'>> = (props) => (
  <Logo {...props} size="xl" />
)

export const LogoFavicon: React.FC<Omit<LogoProps, 'size' | 'showText'>> = (props) => (
  <Logo {...props} size="sm" showText={false} />
)

export default Logo