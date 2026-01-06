# Contributing to LearnSmart

Thank you for your interest in contributing to LearnSmart! This document provides guidelines and information for developers.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learnsmart-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.local.example .env.local
   # Add your Gemini API key to .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
app/                    # Next.js App Router pages
components/             # React components
  ├── Auth/            # Authentication components
  ├── Common/          # Shared components
  ├── Layout/          # Layout components
  ├── Navigation/      # Navigation components
  └── ui/              # Base UI components
store/                 # Zustand state stores
lib/                   # Utilities and helpers
styles/                # Global styles and tokens
data/                  # Static data files
hooks/                 # Custom React hooks
```

## Code Style

### TypeScript
- Use strict TypeScript - no `any` unless absolutely necessary
- Define interfaces for all props and complex types
- Use type inference where possible

### Components
- Use functional components with hooks
- Use `forwardRef` for components that need refs
- Export components as named exports
- Add display names to components

### Naming Conventions
- Components: PascalCase (`Button.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- CSS classes: Use Tailwind utilities, custom classes in kebab-case

### Styling
- Use Tailwind CSS utilities first
- Use CSS variables from `globals.css` for colors
- Prefer inline styles from design tokens over custom CSS
- Keep components responsive by default

## Design System

### Colors
Always use CSS variables:
```tsx
className="bg-[var(--primary)] text-[var(--foreground)]"
```

### Spacing
Use design tokens from `styles/tokens.ts`:
```tsx
import { spacing } from '@/styles/tokens';
```

### Animations
Use Framer Motion with variants from `styles/tokens.ts`:
```tsx
import { animationVariants } from '@/styles/tokens';
<motion.div variants={animationVariants.fadeIn}>
```

## Component Guidelines

### Creating New Components

1. **Create in appropriate directory**
   - UI components → `components/ui/`
   - Feature components → `components/[Feature]/`

2. **Use TypeScript interfaces**
   ```tsx
   interface MyComponentProps {
     title: string;
     onClick?: () => void;
     children: React.ReactNode;
   }
   ```

3. **Support dark mode**
   - Always use CSS variables for colors
   - Test in both light and dark modes

4. **Make it accessible**
   - Add ARIA labels where needed
   - Support keyboard navigation
   - Use semantic HTML

### Example Component Template

```tsx
'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ children, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          'bg-[var(--card)] rounded-[var(--radius-md)]',
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

## State Management

### Zustand Stores

1. **Create store in `store/` directory**
2. **Use TypeScript interfaces**
3. **Use persist middleware for data that should survive refreshes**
4. **Keep stores focused and single-purpose**

Example:
```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'my-storage-key',
    }
  )
);
```

## Testing

```bash
# Type checking
npm run type-check

# Build test
npm run build

# Linting
npm run lint
```

## Commit Guidelines

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add user profile settings page
fix: resolve dark mode toggle issue
docs: update README with deployment instructions
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly (build, type-check, manual testing)
4. Update documentation if needed
5. Create a pull request with clear description
6. Wait for review and address feedback

## Phase Development

The project follows an 11-phase roadmap. Check the current phase and upcoming features in the README.

When working on a new phase:
1. Review the phase requirements
2. Plan the architecture
3. Create necessary files/folders
4. Implement features
5. Test thoroughly
6. Document new features

## Questions?

If you have questions or need help:
1. Check the README first
2. Review existing code for patterns
3. Check the design tokens and component library
4. Ask in the project discussions

Happy coding! 🚀
