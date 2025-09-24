# 🌾 **FARMGUARD** – Farmer Friendly Smart Assistant

![FARMGUARD Logo](public/placeholder-logo.png)

**FARMGUARD** is a farmer-friendly web application prototype built for **SIH25010**. It empowers farmers with weather insights, AI-driven guidance, and crop planning suggestions in a simple and accessible way.

## 🚀 Features

### Core Features
- **📱 Login Flow** – Simple registration with Name, Phone, and Language preference
- **🎯 Onboarding Guide** – Step-by-step tutorial for first-time users
- **📊 Dashboard** – Central hub for all tools and features

### Smart Modules
- **🌤️ Weather Dashboard** – 5-day forecast with actionable farming recommendations
- **🤖 AI Assistant** – Intelligent farming advice powered by OpenAI and Cohere
- **🎙️ Voice Input Support** – Ask questions hands-free for better accessibility
- **🌱 Farm Suggestions** – Personalized crop recommendations with profit calculator
- **🌐 Multilingual Support** – Available in 5 languages: English, Hindi, Kannada, Punjabi, and Tamil

## 🛠️ Tech Stack

### Frontend
- **React** (Next.js) - Modern React framework
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Smooth animations and transitions

### AI & Intelligence
- **OpenAI GPT** - Advanced farming advice and Q&A capabilities
- **Cohere** - Intent classification and language understanding

### APIs & Services
- **OpenWeatherMap** - Real-time weather data and forecasts
- **Mock Data** - Prototype data for crop suggestions and market prices

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnilChettri/FARMGUARD.git
   cd FARMGUARD
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌟 Usage

### Getting Started
1. **Registration**: Enter your name, phone number, and select your preferred language
2. **Onboarding**: Complete the guided tutorial to understand all features
3. **Dashboard**: Access all tools from the central dashboard

### Key Features Usage
- **Weather Insights**: Get 5-day forecasts with farming-specific recommendations
- **AI Assistant**: Ask questions about farming practices, crop diseases, or get general advice
- **Voice Input**: Use the microphone icon to ask questions hands-free
- **Crop Planning**: Get personalized crop suggestions based on your location and preferences
- **Profit Calculator**: Estimate potential profits from different crops

## 🌍 Supported Languages
- English
- Hindi (हिन्दी)
- Kannada (ಕನ್ನಡ)
- Punjabi (ਪੰਜਾਬੀ)
- Tamil (தமிழ்)

## 📱 Progressive Web App (PWA)
FARMGUARD is built as a PWA, offering:
- **Offline functionality** for essential features
- **Mobile-responsive design** for all device types
- **Install prompts** for native app-like experience
- **Push notifications** for important updates

## 🏗️ Project Structure
```
FARMGUARD/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard components
│   └── ...                # Other app pages
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── contexts/             # React contexts
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Global styles
└── README.md
```

## 🤝 Contributing
We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team
- **Anil Chhetri** - Lead Developer
- Email: chettrianil899@gmail.com

## 🙏 Acknowledgments
- Built for Smart India Hackathon 2025 (SIH25010)
- Thanks to all farmers who provided insights during development
- Special thanks to the open-source community for amazing tools and libraries

## 📞 Support
For support, email chettrianil899@gmail.com or create an issue in this repository.

---

<div align="center">
  <strong>Made with ❤️ for Indian Farmers</strong>
  <br>
  <em>Empowering Agriculture Through Technology</em>
</div>
