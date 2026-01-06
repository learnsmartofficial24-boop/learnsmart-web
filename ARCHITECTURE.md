# LearnSmart Architecture Documentation

## Overview

LearnSmart is built with a modern, scalable architecture designed to support 11 phases of development. This document outlines the technical architecture and design decisions.

## Technology Stack

### Frontend Framework
- **Next.js 16.1.1**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript 5**: Type safety and developer experience

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **CSS Variables**: Custom properties for theming
- **Framer Motion**: Animation library for micro-interactions

### State Management
- **Zustand**: Lightweight state management with middleware support
- **localStorage**: Persistent storage via Zustand persist middleware

### AI Integration
- **Gemini AI API**: Google's generative AI for educational content
- **Server-side API routes**: Secure API key management

## Architecture Patterns

### Component Architecture

```
UI Components (Presentational)
├── Atomic Design inspired
├── Fully typed with TypeScript
├── Dark mode support via CSS variables
└── Framer Motion animations

Feature Components (Container)
├── Business logic
├── State management hooks
├── API integration
└── Composition of UI components
```

### State Management Strategy

**Three-Store Pattern:**

1. **Auth Store** (`authStore.ts`)
   - User authentication state
   - Profile information
   - Theme preferences
   - Persisted to localStorage

2. **Learning Store** (`learningStore.ts`)
   - Progress tracking
   - Current subject/chapter
   - Time spent learning
   - Persisted to localStorage

3. **Gamification Store** (`gamificationStore.ts`)
   - XP and levels
   - Streaks and achievements
   - Quiz statistics
   - Persisted to localStorage

### Routing Strategy

**App Router Structure:**

```
app/
├── (root)
│   └── page.tsx                 # Redirect to auth or dashboard
├── auth/
│   ├── layout.tsx              # Centered layout for auth
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   └── stream-select/          # Onboarding flow
├── dashboard/
│   ├── layout.tsx              # Main app layout with nav
│   ├── page.tsx                # Dashboard home
│   ├── profile/
│   ├── classes/
│   ├── settings/
│   └── achievements/
├── learn/                      # Phase 2
├── practice/                   # Phase 7
└── api/
    └── ai/                     # AI API proxy
```

## Design System

### Color System

**CSS Variables approach:**
- Allows runtime theme switching
- No CSS recompilation needed
- Supports light/dark modes seamlessly

```css
/* Light Mode */
--primary: #6B8E7A (Sage Green)
--background: #F5F1EB (Warm Beige)
--foreground: #1F2933 (Charcoal)
--accent: #D4A574 (Gold)

/* Dark Mode */
--primary: #7BA089 (Brighter Sage)
--background: #0F1419 (Dark Blue-Black)
--foreground: #F0EDE5 (Off-White)
```

### Typography Scale

**Font Stack:**
- Inter: Body text (400-700 weights)
- JetBrains Mono: Code and AI responses

**Scale:**
- Using clamp() for responsive sizing
- Maintains hierarchy across breakpoints

### Spacing System

**8-point grid:**
- 4px base unit
- Defined as CSS variables and tokens
- Consistent across all components

## Data Flow

### Authentication Flow

```
User Input → AuthForm
    ↓
Validation (utils)
    ↓
Auth Store (setUser)
    ↓
localStorage (persist middleware)
    ↓
Router redirect
```

### AI Integration Flow

```
User Request → Component
    ↓
API Route (/api/ai)
    ↓
Gemini API (lib/gemini.ts)
    ↓
Response Processing
    ↓
Component State Update
```

### Curriculum Flow

```
User Selection (Class/Stream/Subjects)
    ↓
Curriculum Helper (lib/curriculum.ts)
    ↓
curriculum.json data
    ↓
Filtered subject list
    ↓
Auth Store (selectSubjects)
```

## Performance Optimizations

### Static Generation
- Auth pages pre-rendered at build time
- Dashboard pages use static generation where possible
- Dynamic routes for learning content (Phase 2)

### Code Splitting
- Automatic route-based splitting via Next.js
- Dynamic imports for heavy components (future)
- Lazy loading for animations

### State Optimization
- Zustand provides minimal re-renders
- Selective store subscriptions
- LocalStorage batching via middleware

## Security Considerations

### API Key Management
- Environment variables for sensitive data
- Server-side API routes as proxy
- Never expose keys in client code

### Authentication (Current)
- Client-side state management
- localStorage for persistence
- **Ready for backend integration:**
  - JWT token support
  - Secure HTTP-only cookies
  - Session management

### Input Validation
- Client-side validation with utils
- TypeScript type safety
- Form error handling

## Scalability

### Horizontal Scaling
- Stateless React components
- API routes can be serverless
- No server-side sessions (currently)

### Vertical Scaling
- Lazy loading for large datasets
- Virtual scrolling for long lists (future)
- Image optimization via Next.js

### Database Readiness
- Type definitions prepared for API integration
- Store structure maps to backend models
- CRUD operations scaffolded

## Testing Strategy (Future)

### Unit Tests
- Component testing with Jest
- Utils and helpers testing
- Store testing with Zustand

### Integration Tests
- API route testing
- Form submission flows
- Navigation flows

### E2E Tests
- Playwright for critical paths
- Auth flow testing
- Learning journey testing

## Deployment

### Vercel (Recommended)
- Zero-config deployment
- Edge functions for API routes
- Automatic previews
- Environment variables management

### Docker (Alternative)
- Dockerfile ready
- Multi-stage builds
- Production optimization

### Environment Setup
```bash
# Required
NEXT_PUBLIC_GEMINI_API_KEY=<your-key>

# Optional (future)
DATABASE_URL=<connection-string>
NEXTAUTH_SECRET=<secret>
```

## Future Architecture Considerations

### Phase 2-3: Backend Integration
- REST API or GraphQL
- Database: PostgreSQL or MongoDB
- ORM: Prisma recommended
- Authentication: NextAuth.js

### Phase 4-5: Real-time Features
- WebSocket for live chat
- Server-Sent Events for notifications
- Redis for caching

### Phase 6-7: Advanced Features
- Content Delivery Network for media
- Vector database for semantic search
- Elasticsearch for full-text search

### Phase 8-9: Scale
- Microservices architecture
- Message queue (RabbitMQ/Kafka)
- Load balancing
- Monitoring (Sentry, Datadog)

### Phase 10-11: Enterprise
- Multi-tenancy support
- Role-based access control
- Analytics pipeline
- Admin dashboard

## Development Workflow

1. **Feature Development**
   - Create feature branch
   - Develop in isolation
   - Type-check and build
   - Create PR

2. **Code Review**
   - TypeScript compliance
   - Design system adherence
   - Performance considerations
   - Accessibility check

3. **Deployment**
   - Merge to main
   - Automatic deployment via Vercel
   - Monitor for errors
   - Rollback if needed

## Monitoring & Observability (Future)

- Error tracking: Sentry
- Performance: Vercel Analytics
- User analytics: Custom events
- API monitoring: Custom logging

## Conclusion

This architecture provides a solid foundation for LearnSmart's growth through 11 planned phases. It balances immediate needs with future scalability, maintains clean separation of concerns, and follows modern best practices for Next.js applications.
