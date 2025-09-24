# 🚀 FARMGUARD Development Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Development Commands](#development-commands)
5. [API Documentation](#api-documentation)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## 📦 Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or **pnpm**/**yarn**)
- **Git**: Latest version
- **VS Code** (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint

### API Keys Required
1. **OpenAI API Key** - For AI farming assistant
2. **Cohere API Key** - For language understanding
3. **OpenWeatherMap API Key** - For weather data

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/AnilChettri/FARMGUARD.git
cd FARMGUARD/Farmguard-d7-main

# Install dependencies
npm install
# OR
pnpm install
# OR
yarn install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your API keys
nano .env.local  # or use your preferred editor
```

### 3. Run Development Server
```bash
npm run dev
# OR
pnpm dev
# OR
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# AI Services
OPENAI_API_KEY=your_openai_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
WEATHER_API_KEY=your_openweathermap_api_key_here

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Settings
USE_MOCK_DATA=false  # Set to true to use mock data when API keys are missing
DEBUG=false
```

### API Key Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy and paste into `.env.local`

#### Cohere API Key
1. Visit [Cohere Dashboard](https://dashboard.cohere.ai/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy and paste into `.env.local`

#### OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account
3. Generate an API key
4. Copy and paste into `.env.local`

### Mock Data Mode

If you don't have API keys ready, you can start development using mock data:

```env
USE_MOCK_DATA=true
NEXT_PUBLIC_USE_MOCK_DATA=true
```

This will use realistic mock data for all services.

## 💻 Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build and analyze bundle
npm run analyze

# Type checking
npx tsc --noEmit
```

## 🔗 API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

### Endpoints

#### AI Assistant
```http
POST /api/ai-assistant
Content-Type: application/json

{
  "message": "How do I grow tomatoes?",
  "language": "en"  // optional: en, hi, kn, pa, ta
}
```

**Response:**
```json
{
  "success": true,
  "response": "To grow tomatoes successfully...",
  "language": "en",
  "timestamp": "2025-09-23T10:30:00.000Z",
  "source": "openai"
}
```

#### Weather Data
```http
GET /api/weather?lat=30.9010&lon=75.8573
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "name": "Ludhiana",
      "country": "India",
      "lat": 30.9010,
      "lon": 75.8573
    },
    "forecast": [
      {
        "date": "2025-09-23",
        "day": "Today",
        "high": 32,
        "low": 24,
        "condition": "Sunny",
        "humidity": 65,
        "windSpeed": 12,
        "rainfall": 0,
        "farmingRecommendations": [
          "Good conditions for harvesting",
          "Increase watering frequency"
        ]
      }
    ],
    "alerts": []
  },
  "source": "openweathermap"
}
```

#### Market Information
```http
GET /api/market-info?crop=rice&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prices": [
      {
        "crop": "Rice",
        "currentPrice": 2500,
        "previousPrice": 2400,
        "change": 100,
        "changePercentage": 4.17,
        "unit": "₹/quintal",
        "market": "Ludhiana Mandi",
        "trend": "up",
        "quality": "premium"
      }
    ],
    "alerts": [],
    "summary": {
      "totalCrops": 1,
      "pricesUp": 1,
      "pricesDown": 0
    }
  }
}
```

#### Farm Suggestions
```http
GET /api/farm-suggestions?season=Rabi&soilType=loamy&limit=3
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "crop-001",
        "cropName": "Wheat",
        "variety": "HD 2967",
        "season": "Rabi",
        "expectedYield": 45,
        "yieldUnit": "quintal/hectare",
        "profitability": {
          "investmentCost": 28000,
          "expectedRevenue": 90000,
          "profit": 62000,
          "roi": 221
        },
        "suitability": {
          "soilType": ["Loamy", "Sandy loam"],
          "waterRequirement": "medium",
          "difficulty": "easy",
          "suitabilityScore": 90
        }
      }
    ],
    "currentSeason": "Rabi",
    "totalSuggestions": 3
  }
}
```

### Error Handling

All APIs follow a consistent error format:

```json
{
  "success": false,
  "error": "Error message description",
  "data": null,
  "source": "error"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid API key)
- `429` - Rate limit exceeded
- `500` - Internal server error

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
__tests__/
├── components/
│   ├── ui/
│   └── pages/
├── api/
│   ├── ai-assistant.test.ts
│   ├── weather.test.ts
│   └── market-info.test.ts
└── utils/
    └── helpers.test.ts
```

### Writing Tests

Example component test:
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

Example API test:
```typescript
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/ai-assistant'

describe('/api/ai-assistant', () => {
  it('returns AI response', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { message: 'Test question', language: 'en' }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
  })
})
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Docker Deployment
```bash
# Build Docker image
docker build -t farmguard .

# Run container
docker run -p 3000:3000 farmguard
```

### Manual Deployment
```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🛠️ Development Best Practices

### Code Structure
- Follow Next.js App Router conventions
- Use TypeScript for type safety
- Implement proper error boundaries
- Use Suspense for loading states
- Implement proper SEO meta tags

### Component Guidelines
- Use shadcn/ui components as base
- Implement proper accessibility (ARIA labels)
- Use TypeScript interfaces for props
- Implement proper loading and error states
- Follow responsive design principles

### API Guidelines
- Use proper HTTP status codes
- Implement rate limiting
- Add input validation
- Use consistent response formats
- Implement proper error handling

### Performance
- Optimize images with Next.js Image component
- Use dynamic imports for large components
- Implement proper caching strategies
- Monitor bundle size
- Use React.memo for expensive components

## 🐛 Troubleshooting

### Common Issues

#### Port 3000 already in use
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

#### API Keys not working
1. Check `.env.local` file exists and has correct keys
2. Restart development server after adding keys
3. Verify API keys are valid and have sufficient credits

#### Build errors
```bash
# Clear Next.js cache
npx next clean

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### TypeScript errors
```bash
# Type check
npx tsc --noEmit

# Update type definitions
npm install --save-dev @types/node @types/react @types/react-dom
```

### Getting Help

1. **Documentation**: Check this file and README.md
2. **Issues**: Create GitHub issue for bugs
3. **Discussions**: Use GitHub Discussions for questions
4. **Contact**: Email chettrianil899@gmail.com

### Development Environment Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] Development server running
- [ ] API endpoints responding
- [ ] Mock data mode working (if needed)
- [ ] Tests passing
- [ ] TypeScript compiling without errors

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)

---

**Happy Farming! 🌾** This setup guide should get you up and running with FARMGUARD development. If you encounter any issues, please refer to the troubleshooting section or create an issue on GitHub.