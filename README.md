# LearnSmart Web - AI-Powered Learning Platform

LearnSmart is a modern, production-ready educational web platform built with Next.js 14+ that provides concept-based learning with AI assistance.

## 🚀 Features

- **Complete Design System**: Locked-in brand identity with custom CSS variables and design tokens
- **Authentication Flow**: Full auth pages (login, signup, forgot password, password reset)
- **Smart Onboarding**: Class, stream, and subject selection for personalized learning
- **Responsive UI**: Mobile-first design that works across all devices
- **Dark Mode**: Built-in theme toggle with persistent preferences
- **Component Library**: 10+ reusable, accessible components
- **State Management**: Zustand stores for auth, learning progress, and gamification
- **AI Integration**: Gemini AI API ready for content generation and tutoring
- **Gamification**: XP system, levels, streaks, and achievements
- **Type-Safe**: Full TypeScript coverage with strict mode

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Gemini AI API
- **Fonts**: Inter, JetBrains Mono

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Gemini API key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎨 Design System

### Color Palette

**Light Mode:**
- Primary: `#6B8E7A` (Sage Green)
- Background: `#F5F1EB` (Warm Beige)
- Text: `#1F2933` (Charcoal)
- Accent: `#D4A574` (Gold)

**Dark Mode:**
- Background: `#0F1419`
- Surface: `#1A1F2E`
- Text: `#F0EDE5`
- Primary: `#7BA089` (Brighter Sage)

### Typography

- **Headings**: Inter (700 weight)
- **Body**: Inter (400-600 weight)
- **Code/AI**: JetBrains Mono

### Design Tokens

Located in `styles/tokens.ts`:
- Spacing scale (4px - 64px)
- Border radius (8px, 12px, 16px)
- Shadows (subtle, hover, elevation)
- Transitions (200ms, 300ms)
- Animation variants for Framer Motion

## 📁 Project Structure

```
.
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── stream-select/
│   ├── dashboard/               # Main dashboard
│   │   ├── profile/
│   │   ├── classes/
│   │   └── settings/
│   ├── learn/                   # Learning pages (future)
│   ├── practice/                # Quiz pages (future)
│   └── api/                     # API routes
├── components/
│   ├── Layout/                  # Layout components
│   ├── Navigation/              # Nav and sidebar
│   ├── Auth/                    # Auth-specific components
│   ├── Common/                  # Shared components
│   └── ui/                      # Base UI components
├── store/
│   ├── authStore.ts            # Authentication state
│   ├── learningStore.ts        # Learning progress
│   └── gamificationStore.ts    # XP, levels, achievements
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── utils.ts                # Utility functions
│   ├── curriculum.ts           # Curriculum data helpers
│   └── gemini.ts               # AI API integration
├── styles/
│   ├── globals.css             # Global styles + CSS vars
│   └── tokens.ts               # Design tokens
├── data/
│   └── curriculum.json         # Subject/stream data
└── hooks/
    └── useAuth.ts              # Auth hook
```

## 🧩 Component Library

### UI Components

- **Button**: Primary, secondary, outline, ghost, danger variants
- **Card**: Hover effects, customizable padding
- **Input**: With validation, password toggle, error states
- **Badge**: Status badges with color variants
- **Spinner**: Loading states with sizes
- **Modal**: Accessible modal dialogs
- **Toast**: Notification system

### Layout Components

- **MainLayout**: Top nav + sidebar + content area
- **TopNav**: Header with logo, theme toggle, profile
- **Sidebar**: Collapsible navigation menu
- **PageContainer**: Consistent page padding

### Auth Components

- **AuthForm**: Reusable login/signup form
- **StreamSelector**: Choose Science/Commerce/Arts
- **SpecializationSelector**: PCM/PCB for science stream
- **SubjectSelector**: Core + optional subject selection

## 🎓 Curriculum Structure

Supports:
- **Classes 1-5**: Basic subjects (English, Hindi, Maths, EVS)
- **Classes 6-10**: Standard subjects
- **Classes 11-12**: Stream-based learning
  - **Science**: PCM or PCB specializations
  - **Commerce**: Accountancy, Business, Economics
  - **Arts**: History, Political Science, Geography, etc.

## 🤖 AI Integration

The Gemini AI API is integrated for:
- Generating MCQ questions
- Explaining concepts
- Providing study tips
- Creating practice problems

**Usage:**

```typescript
import { generateAIResponse, generateMCQs } from '@/lib/gemini';

// Generate a response
const response = await generateAIResponse('Explain photosynthesis');

// Generate quiz questions
const mcqs = await generateMCQs('Photosynthesis', 'Biology', 5);
```

## 🎮 Gamification System

- **XP Points**: Earned through learning activities
- **Levels**: Auto-calculated from XP (100 XP per level)
- **Streaks**: Daily learning streak tracking
- **Achievements**: Unlockable badges (coming soon)
- **Stats**: Track quizzes taken, questions answered, accuracy

## 🔐 Authentication

Current implementation uses client-side state with localStorage persistence. The auth flow is ready for backend integration:

1. User signs up
2. Selects class, stream (if 11-12), specialization (if science)
3. Chooses subjects
4. Redirected to dashboard

**To integrate a backend:**
- Update `AuthForm` to call your API
- Replace `generateId()` with server-generated IDs
- Add JWT token management
- Implement proper session handling

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Add these to your deployment platform:
- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Gemini API key

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Build production
npm run build

# Start production server
npm start
```

## 📝 Future Development Phases

This foundation supports all 11 planned phases:

1. ✅ **Foundation** - Complete!
2. **Learning Pages** - Subject/chapter content
3. **AI Chat** - Real-time tutoring
4. **Quiz System** - Interactive assessments
5. **Progress Tracking** - Analytics dashboard
6. **Concept Maps** - Visual learning paths
7. **Spaced Repetition** - Smart review system
8. **Social Features** - Study groups, leaderboards
9. **Mobile App** - React Native version
10. **Teacher Dashboard** - Class management
11. **Enterprise** - School/institution features

## 🤝 Contributing

This is a production-ready foundation. To extend:

1. Add new components to `components/`
2. Create new pages in `app/`
3. Update stores in `store/` for new state
4. Add API routes in `app/api/`

## 📄 License

All rights reserved © 2024 LearnSmart

## 🙏 Credits

Built with ❤️ using modern web technologies:
- Next.js by Vercel
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Zustand
- Google Gemini AI

---

**Ready for Production** ✨
