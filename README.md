# Liberty AI - America's AI Platform

A modern, privacy-focused AI chat platform built with Next.js, featuring multiple AI modes including search, general chat, image generation, and code assistance.

## 🚀 Features

### 🔍 **Search Mode**
- Real-time web search with AI-powered responses
- Automatic data table generation for structured information
- Streaming follow-up questions
- Powered by advanced search algorithms

### 💬 **General Mode** 
- AI conversations with file attachment support
- Document analysis and processing
- Multi-modal interactions

### 🎨 **Image Generation Mode**
- AI-powered image creation using Minimax API
- High-quality image generation from text prompts
- Multiple aspect ratios and styles

### 💻 **Code Mode**
- Coming soon: Advanced code generation and assistance

## 🛡️ Privacy & Security

- **100% Private** - Your data stays secure
- **Zero Censorship** - Uncensored AI responses
- **US Hosted** - American infrastructure
- **America's AI** - Built for freedom of expression

## 📱 Mobile Optimized

- **Responsive Design** - Perfect on all devices
- **Touch-Friendly** - Optimized mobile interactions
- **Fast Performance** - Smooth mobile experience
- **Professional UI** - Clean, modern interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **AI Integration**: Multiple AI providers
- **Image Generation**: Minimax API
- **Search**: Advanced web search integration
- **Mobile**: Responsive design with touch optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd liberty-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
# Add your API keys here
MINIMAX_API_KEY=your_minimax_key
# Add other required API keys
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
liberty-ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles with mobile optimizations
│   └── layout.tsx         # Root layout component
├── components/            # React components
│   ├── chat.tsx          # Main chat interface
│   ├── chat-panel.tsx    # Chat input and controls
│   ├── chat-messages.tsx # Message display
│   └── ui/               # UI components
├── lib/                  # Utility libraries
│   ├── agents/           # AI agent implementations
│   ├── services/         # API service integrations
│   └── streaming/        # Streaming utilities
└── public/              # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Minimax API for image generation
MINIMAX_API_KEY=your_minimax_api_key

# Add other API keys as needed
# OPENAI_API_KEY=your_openai_key
# ANTHROPIC_API_KEY=your_anthropic_key
```

### Mobile Optimization

The app includes comprehensive mobile optimizations:

- Responsive breakpoints for all screen sizes
- Touch-friendly 44px minimum touch targets
- iOS-specific optimizations (16px font size to prevent zoom)
- Safe area support for notched devices
- Fixed positioning for mobile chat interface

## 🎨 Customization

### Themes
The app supports light/dark themes with automatic system detection.

### Styling
- Tailwind CSS for utility-first styling
- Shadcn/UI for consistent component design
- Custom CSS for mobile optimizations

### AI Providers
Easy to add new AI providers by extending the service layer in `lib/services/`.

## 📱 Mobile Features

- **Responsive Layout**: Adapts to all screen sizes
- **Touch Optimization**: Perfect touch targets and gestures
- **Performance**: Optimized for mobile devices
- **Offline Support**: Progressive Web App capabilities

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from Shadcn/UI
- Icons from Lucide React
- Styling with Tailwind CSS

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Liberty AI - America's AI Platform** 🇺🇸
