# Quick Start Guide

Get LearnSmart running in 5 minutes! ⚡

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 4. Try the App

### Sign Up Flow
1. Click "Sign up" on login page
2. Enter your details
3. Select your class (11 for stream selection)
4. Choose a stream (Science/Commerce/Arts)
5. Pick specialization (if Science)
6. Select subjects
7. Explore dashboard!

### Toggle Dark Mode
Click the moon/sun icon in the top nav bar 🌙☀️

### Explore Features
- **Dashboard**: View your profile and stats
- **Classes**: See your enrolled subjects
- **Settings**: Customize preferences
- **Achievements**: Track your progress

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run type-check       # Check TypeScript
npm run lint             # Lint code

# Quick fixes
rm -rf .next             # Clear build cache
rm -rf node_modules      # Clear dependencies
npm install              # Reinstall
```

## Project Structure at a Glance

```
app/
├── auth/           → Login, signup, etc.
├── dashboard/      → Main app pages
└── api/           → API routes

components/
├── ui/            → Buttons, cards, inputs
├── Auth/          → Auth-specific components
├── Layout/        → Page layouts
└── Navigation/    → Nav and sidebar

store/             → Zustand state stores
lib/               → Utilities and helpers
styles/            → Global CSS and tokens
```

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with fonts |
| `app/globals.css` | Design system CSS |
| `store/authStore.ts` | User authentication |
| `lib/gemini.ts` | AI integration |
| `lib/curriculum.ts` | Subject data |
| `styles/tokens.ts` | Design tokens |

## Design System Quick Reference

### Colors (CSS Variables)
```css
var(--primary)      /* Sage green */
var(--background)   /* Beige/Dark */
var(--foreground)   /* Charcoal/Light */
var(--accent)       /* Gold */
var(--card)         /* White/Dark surface */
var(--border)       /* Border color */
```

### Using Components

```tsx
import { Button, Card, Input } from '@/components/ui';

<Button variant="primary" size="lg">
  Click Me
</Button>

<Card padding="lg">
  Content here
</Card>

<Input
  label="Email"
  type="email"
  error={errorMessage}
/>
```

### Using Stores

```tsx
import { useAuthStore } from '@/store/authStore';

const { user, toggleTheme } = useAuthStore();
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Build Errors
```bash
# Clear everything and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Check what's wrong
npm run type-check
```

### Dark Mode Not Working
- Make sure theme toggle in TopNav is clicked
- Check browser console for errors
- Verify CSS variables are loading

## What's Next?

1. **Read the full [README.md](./README.md)**
2. **Check [ARCHITECTURE.md](./ARCHITECTURE.md)** for technical details
3. **Review [CONTRIBUTING.md](./CONTRIBUTING.md)** to contribute
4. **See [DEPLOYMENT.md](./DEPLOYMENT.md)** to deploy

## Need Help?

- 📖 Documentation in repository
- 🐛 Report issues on GitHub
- 💬 Check existing issues/discussions

## Tips for Development

✅ Use TypeScript strictly (no `any` unless necessary)
✅ Follow component patterns in `components/ui/`
✅ Test in both light and dark modes
✅ Keep responsive design in mind
✅ Use design tokens from `styles/tokens.ts`
✅ Validate forms properly
✅ Handle loading and error states

---

**Happy Coding!** 🚀

Made with ❤️ for learners everywhere.
