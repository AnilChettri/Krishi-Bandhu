# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

FarmGuard is a farmer-friendly Progressive Web App (PWA) built for the Smart India Hackathon 2025 (SIH25010). It empowers small and marginal farmers with AI-driven guidance, weather insights, crop planning, and market information in 5 languages: English, Hindi, Kannada, Punjabi, and Tamil.

## Development Commands

### Basic Commands
```powershell
# Development server
npm run dev          # Starts dev server at http://localhost:3000
pnpm dev            # Alternative using pnpm

# Production build
npm run build       # Builds the application for production
npm start           # Starts production server

# Code quality
npm run lint        # Runs ESLint with Next.js configuration
```

### Package Management
```powershell
# Install dependencies
npm install
# or
pnpm install

# Add new dependencies
npm install <package-name>
pnpm add <package-name>
```

### Testing Individual Components
```powershell
# To test a specific page route during development:
# Navigate to http://localhost:3000/<route>
# Examples:
# - http://localhost:3000/dashboard/farmer
# - http://localhost:3000/ai-assistant  
# - http://localhost:3000/weather
# - http://localhost:3000/farm-suggestions
```

## Architecture Overview

### Application Structure
- **Next.js 14.2.16** with App Router architecture
- **TypeScript** for type safety
- **TailwindCSS 4.1.9** for styling with shadcn/ui components
- **PWA-enabled** with offline functionality via service worker
- **Multilingual support** with React Context for i18n (5 languages: English, Hindi, Kannada, Punjabi, Tamil)

### Key Architectural Patterns

#### 1. Multi-Language Context System
The app uses React Context (`contexts/language-context.tsx`) for internationalization:
- Language selection persists in localStorage as 'farmguard-language'
- Automatic browser language detection fallback
- Translation function `t()` available throughout the app
- Support for en, hi, kn, pa, ta

#### 2. API Configuration & Fallback System
Located in `lib/api-config.ts`:
- **OpenAI GPT-3.5-turbo** for AI farming assistant
- **Cohere API** for intent classification
- **OpenWeatherMap** for weather data
- **Graceful fallback** to mock data when APIs unavailable
- Rate limiting configuration for production usage

#### 3. Authentication Flow
- Simple authentication with localStorage persistence
- User flow: Language Selection → Sign In/Up → Dashboard
- Authentication state checked in root page component
- User email stored as 'user-authenticated' and 'user-email' in localStorage

#### 4. Component Architecture
- **Layout System**: `FarmGuardLayout` provides consistent navigation
- **UI Components**: shadcn/ui components in `/components/ui/`
- **Custom Components**: Farm-specific components in `/components/`
- **Loading States**: Skeleton components for better UX
- **PWA Components**: Install prompts and offline detection

### Core Features Implementation

#### AI Assistant (`/app/ai-assistant/`)
- **Backend**: API route at `/api/ai-assistant/route.ts`
- **Farming-focused system prompts** for relevant responses
- **Language-aware responses** based on user's selected language
- **Fallback responses** when OpenAI API unavailable

#### Weather System (`/app/weather/`)
- **5-day forecast** with farming recommendations
- **Weather alerts** prominently displayed on dashboard
- **Farming-specific data**: humidity, wind, rain probability
- **Action recommendations** based on weather conditions

#### Dashboard (`/app/dashboard/farmer/`)
- **Weather priority**: Weather card shown first for farming decisions
- **Quick actions**: Direct access to most-used features
- **Farm metrics**: Acres, active crops, profit estimates
- **Guided tutorial**: Step-by-step onboarding for farmers

#### Market Information (`/app/market-info/`)
- **Real-time price display** with trend indicators
- **Market selection** for regional pricing
- **Demand indicators** (High/Low) for crop planning

## Environment Setup

### Required Environment Variables
Create `.env.local` in root directory:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key  
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
```

Note: The app will function with mock data if API keys are not provided.

## Development Guidelines

### Adding New Languages
1. Add language code to `lib/i18n.ts` in the `languages` object
2. Add translations in the `translations` object 
3. Update `supportedLanguages` array in `getTranslation` function
4. Test language switching in the UI

### Creating New Pages
1. Create page in `/app/<route>/page.tsx`
2. Wrap with `FarmGuardLayout` for consistent navigation
3. Use `useLanguage()` hook for translations
4. Add loading states with skeleton components
5. Consider offline functionality for core features

### API Route Development
1. Place API routes in `/app/api/<endpoint>/route.ts`
2. Follow the fallback pattern from `ai-assistant/route.ts`
3. Include proper error handling and rate limiting
4. Provide mock responses for development

### Component Development
1. Use TypeScript interfaces for props
2. Follow shadcn/ui component patterns
3. Include responsive design (mobile-first)
4. Add proper accessibility attributes
5. Use Lucide React icons consistently

### PWA Development
- Service worker located at `/public/sw.js`
- Manifest configuration in `/public/manifest.json`
- Install prompts handled by `PWAInstallPrompt` component
- Test offline functionality during development

## Key Dependencies

### UI & Styling
- **@radix-ui/react-*** - Accessible UI primitives
- **tailwindcss** - Utility-first CSS framework
- **lucide-react** - Icon library
- **class-variance-authority** - Component variants

### Development Tools
- **TypeScript** - Type safety
- **@tailwindcss/postcss** - PostCSS integration
- **autoprefixer** - CSS vendor prefixes

### AI & APIs
- **OpenAI** - GPT-3.5-turbo for farming advice
- **Cohere** - Intent classification
- **OpenWeatherMap** - Weather data

## Troubleshooting

### Common Issues
1. **API Keys Missing**: App falls back to mock data - check console for warnings
2. **Language Not Saving**: Clear localStorage and test language selection flow
3. **PWA Not Installing**: Check manifest.json and service worker registration
4. **Build Errors**: TypeScript errors ignored in next.config.mjs - fix for production

### Debugging
- Check browser console for API errors
- Use React DevTools for context state inspection
- Test offline functionality by disabling network in DevTools
- Verify localStorage entries for user state

## Production Considerations

### Performance
- Images are unoptimized in next.config.mjs for development
- Consider optimizing for production deployment
- Implement proper caching strategies for API calls

### Accessibility
- App supports multiple Indian languages with proper RTL/LTR handling
- Visual guides and tutorials for non-tech-savvy farmers
- Voice input support mentioned in README (implementation needed)

### Security
- API keys are client-side (suitable for development)
- Implement server-side API proxies for production
- Add proper authentication system beyond localStorage
