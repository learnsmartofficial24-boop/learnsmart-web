# LearnSmart Visual Style Guide

## 🎨 Brand Identity

LearnSmart embodies a **modern, calm, and professional** aesthetic that promotes focus and learning. Our design system creates a cohesive experience across all touchpoints.

### Brand Personality
- **Modern**: Clean, contemporary design
- **Calm**: Soothing colors that reduce stress
- **Professional**: Enterprise-ready quality
- **Accessible**: Inclusive for all learners
- **Trustworthy**: Consistent and reliable

## 🌈 Color Palette

### Primary Colors

#### Light Mode
```css
Sage Green (Primary)
#6B8E7A
RGB: 107, 142, 122
Usage: Buttons, links, accents

Warm Beige (Background)
#F5F1EB
RGB: 245, 241, 235
Usage: Page backgrounds

Charcoal (Text)
#1F2933
RGB: 31, 41, 51
Usage: Body text, headings

Gold (Accent)
#D4A574
RGB: 212, 165, 116
Usage: Highlights, badges
```

#### Dark Mode
```css
Bright Sage (Primary)
#7BA089
RGB: 123, 160, 137
Usage: Buttons, links, accents

Dark Blue-Black (Background)
#0F1419
RGB: 15, 20, 25
Usage: Page backgrounds

Off-White (Text)
#F0EDE5
RGB: 240, 237, 229
Usage: Body text, headings

Gold (Accent)
#D4A574
RGB: 212, 165, 116
Usage: Highlights, badges
```

### Semantic Colors

```css
Success: #4CAF50 (Green)
Warning: #FFC107 (Amber)
Error: #F44336 (Red)
Info: #2196F3 (Blue)
```

### Usage Guidelines

✅ **Do:**
- Use primary sage for interactive elements
- Use semantic colors for status messages
- Maintain sufficient contrast ratios (WCAG AA)
- Test in both light and dark modes

❌ **Don't:**
- Mix light/dark mode colors
- Use low-contrast combinations
- Override brand colors without reason
- Use pure black or white

## 📝 Typography

### Font Families

```css
/* Headings & UI */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Code & Technical */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale

```
H1: 48px / 3rem   - Page titles
H2: 36px / 2.25rem - Section headers
H3: 28px / 1.75rem - Subsection headers
H4: 24px / 1.5rem  - Card headers

Body Large: 18px / 1.125rem
Body Base: 16px / 1rem (default)
Body Small: 14px / 0.875rem
Caption: 12px / 0.75rem
```

### Font Weights

```css
Regular: 400 - Body text
Medium: 500  - Subtle emphasis
Semibold: 600 - Button labels
Bold: 700    - Headings
```

### Line Heights

```css
Headings: 1.2  - Tight for impact
Body: 1.6      - Comfortable reading
Captions: 1.4  - Compact information
```

### Usage Guidelines

✅ **Do:**
- Use Inter for all UI text
- Use JetBrains Mono for code/technical content
- Maintain clear hierarchy
- Use responsive font sizes (clamp)

❌ **Don't:**
- Mix too many font sizes on one page
- Use font sizes smaller than 12px
- Ignore line-height for readability
- Use decorative fonts

## 📐 Spacing System

### 8-Point Grid

```css
4px   - var(--space-xs)  - Tight spacing
8px   - var(--space-sm)  - Compact
12px  - var(--space-md)  - Default
16px  - var(--space-lg)  - Comfortable
24px  - var(--space-xl)  - Spacious
32px  - var(--space-2xl) - Section breaks
48px  - var(--space-3xl) - Large gaps
64px  - var(--space-4xl) - Page sections
```

### Usage Guidelines

✅ **Do:**
- Use consistent spacing throughout
- Follow 8-point grid multiples
- Use spacing tokens from design system
- Maintain breathing room

❌ **Don't:**
- Use arbitrary pixel values
- Cram content too tightly
- Over-space simple elements
- Ignore vertical rhythm

## 🔘 Components

### Buttons

#### Variants
```tsx
Primary:   Sage background, white text
Secondary: White background, dark text
Outline:   Transparent with sage border
Ghost:     Transparent, hover background
Danger:    Red background, white text
```

#### Sizes
```tsx
Small:  px-3 py-1.5 text-sm
Medium: px-4 py-2 text-base
Large:  px-6 py-3 text-lg
```

#### States
- Default: Base styling
- Hover: Slight scale (1.02)
- Active: Scale down (0.98)
- Disabled: 50% opacity
- Loading: Spinner + "Loading..."

### Cards

```tsx
Default: White/Dark surface
Hover: Subtle lift effect (-2px)
Padding: sm (16px), md (24px), lg (32px)
Border: 1px solid border color
Radius: 12px (medium)
Shadow: Subtle elevation
```

### Inputs

```tsx
Height: 40px (py-2.5)
Border: 1px solid border
Radius: 8px (small)
Focus: 2px ring in primary
Error: Red border + message
Password: Eye toggle icon
```

### Badges

```tsx
Sizes: sm, md, lg
Variants: default, success, warning, error, info
Shape: Pill (fully rounded)
Font: Medium weight, uppercase optional
```

## 🎭 Shadows

```css
Subtle: 0 1px 3px rgba(0,0,0,0.06)
  Usage: Cards, inputs at rest

Hover: 0 4px 12px rgba(0,0,0,0.1)
  Usage: Interactive elements on hover

Elevation: 0 8px 24px rgba(0,0,0,0.12)
  Usage: Modals, dropdowns, tooltips
```

### Usage Guidelines

✅ **Do:**
- Use subtle shadows for depth
- Increase shadow on interaction
- Adjust shadow opacity in dark mode

❌ **Don't:**
- Overuse heavy shadows
- Mix shadow styles
- Use shadows without purpose

## 🎬 Motion & Animation

### Timing

```css
Fast: 200ms    - Micro-interactions
Base: 300ms    - Standard transitions
Slow: 500ms    - Page transitions
```

### Easing

```css
ease-out - Default (comfortable)
ease-in-out - Smooth both ways
linear - Loading spinners
```

### Animation Types

```tsx
fadeIn: Opacity 0 → 1
slideUp: translateY(20px) → 0
slideDown: translateY(-20px) → 0
scale: scale(0.95) → 1
pulse: Opacity cycle for loading
```

### Usage Guidelines

✅ **Do:**
- Use subtle animations
- Respect prefers-reduced-motion
- Keep animations under 500ms
- Use for feedback and delight

❌ **Don't:**
- Overanimate everything
- Use long, distracting animations
- Animate purely for decoration
- Ignore accessibility preferences

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   - Small tablets
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

### Mobile-First Approach

```tsx
/* Base: Mobile */
className="text-base p-4"

/* Tablet and up */
className="text-base md:text-lg p-4 md:p-6"

/* Desktop and up */
className="text-base md:text-lg lg:text-xl p-4 md:p-6 lg:p-8"
```

### Layout Patterns

```tsx
Stack: flex flex-col gap-4
Row: flex flex-row gap-4
Grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Container: max-w-7xl mx-auto px-4
```

## 🌓 Dark Mode

### Implementation

```tsx
// Use CSS variables
className="bg-[var(--background)] text-[var(--foreground)]"

// Theme toggle
const { toggleTheme } = useAuthStore();
```

### Design Considerations

✅ **Do:**
- Use slightly desaturated colors
- Reduce shadow opacity
- Maintain contrast ratios
- Test all components in both modes

❌ **Don't:**
- Use pure black backgrounds
- Ignore contrast in dark mode
- Forget to test all states
- Hard-code color values

## ♿ Accessibility

### Color Contrast

```
Normal text: 4.5:1 minimum (WCAG AA)
Large text: 3:1 minimum (WCAG AA)
Interactive elements: 3:1 minimum
```

### Focus States

```tsx
All interactive elements must have visible focus:
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-[var(--primary)]
```

### Semantic HTML

```tsx
✅ Use <button> for actions
✅ Use <a> for navigation
✅ Use headings in order (h1, h2, h3)
✅ Use <nav> for navigation
✅ Use <main> for main content
```

## 📋 Best Practices

### Component Styling

```tsx
// ✅ Good
<Button 
  variant="primary" 
  size="lg"
  className="w-full"
>
  Submit
</Button>

// ❌ Bad (inline styles)
<button style={{ backgroundColor: '#6B8E7A' }}>
  Submit
</button>
```

### Consistent Patterns

```tsx
// ✅ Always use design tokens
const spacing = spacing.lg;

// ✅ Always use CSS variables
className="bg-[var(--primary)]"

// ✅ Always use utility classes
className="px-4 py-2 rounded-md"
```

### Code Organization

```tsx
// ✅ Component structure
const MyComponent = () => {
  // 1. Hooks
  const { user } = useAuthStore();
  
  // 2. State
  const [isOpen, setIsOpen] = useState(false);
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Handlers
  const handleClick = () => {};
  
  // 5. Render
  return <div>...</div>;
};
```

## 🎯 Design Checklist

Before considering a component complete:

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Keyboard accessible
- [ ] Focus states visible
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Empty states handled
- [ ] Animations smooth
- [ ] Colors from design system
- [ ] Typography consistent
- [ ] Spacing follows 8-point grid
- [ ] ARIA labels where needed
- [ ] Semantic HTML used

## 📚 Resources

### Internal
- `styles/tokens.ts` - Design tokens
- `app/globals.css` - CSS variables
- `components/ui/` - Component examples

### External
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [Material Design Motion](https://material.io/design/motion)

---

**Remember**: Consistency is key. When in doubt, refer to existing components and follow established patterns.

**Made with ❤️ for a beautiful learning experience.**
