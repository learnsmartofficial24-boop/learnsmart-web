# Phase 9: Spaced Repetition & Flashcard System

## What Was Implemented

A complete spaced repetition flashcard system using the scientifically-backed SM-2 (SuperMemo 2) algorithm.

## Quick Start

1. The flashcard system is accessible at `/review`
2. Navigate there using the Sidebar "Flashcards" link
3. Sample decks are available for testing

## Key Components

### Core Libraries

1. **SM-2 Algorithm** (`lib/spacedRepetition.ts`)
   - Calculates optimal review intervals based on performance
   - Tracks easiness factor per card
   - Estimates retention using forgetting curves

2. **Flashcard Generator** (`lib/flashcardGenerator.ts`)
   - AI-powered card generation using Gemini API
   - CSV import/export for bulk operations
   - Card validation

3. **Review Session Manager** (`lib/reviewSession.ts`)
   - Handles active review sessions
   - Tracks time, progress, and statistics
   - Suggests breaks for optimal learning

### Pages

- `/review` - Main dashboard with due cards and stats
- `/review/decks` - Browse all decks
- `/review/decks/[deckId]` - View deck details
- `/review/decks/[deckId]/edit` - Edit deck
- `/review/session/[deckId]` - Active review session

### Components

- **FlashcardViewer** - Animated card flip interface
- **ReviewControls** - Quality rating (1-5) buttons
- **SessionSummary** - End-of-session stats and XP
- **ReviewDashboard** - Main hub with quick stats
- **FlashcardDeckBrowser** - List and search decks
- **DeckPreview** - Detailed deck information
- **ScheduleViewer** - Calendar view of upcoming reviews
- **FlashcardStats** - Individual card performance
- **DeckCreator** - Create/edit decks with CSV import

## Features

✅ SM-2 spaced repetition algorithm
✅ Quality-based scheduling (1-5 rating)
✅ Automatic interval calculation
✅ Due card prioritization
✅ Flashcard flip animations
✅ Keyboard shortcuts (Space, 1-5, N)
✅ Session statistics and XP
✅ Streak tracking
✅ Review schedule calendar
✅ CSV import/export
✅ Dark mode support
✅ Mobile responsive design
✅ localStorage persistence

## Keyboard Shortcuts

- **Space / Enter**: Flip card
- **1-5**: Rate card quality
- **N**: Skip to next card

## Quality Ratings

- **1**: Complete blackout
- **2**: Incorrect response
- **3**: Correct with hesitation
- **4**: Correct response
- **5**: Perfect, instant response

## Future Enhancements (Not in this phase)

- Difficulty-based scheduling variants
- Leitner system hybrid
- Collaborative deck creation
- Deck sharing
- Leaderboards
- Voice card support
- Image/diagram cards
- Integration with concept maps
- Notification system

## Files Created

### Library Files
- `lib/spacedRepetition.ts` - SM-2 algorithm
- `lib/flashcardGenerator.ts` - AI generation
- `lib/reviewSession.ts` - Session management
- `lib/initializeFlashcards.ts` - Sample data loader
- `lib/types.ts` (updated) - Flashcard types

### Store
- `store/flashcardStore.ts` - Zustand store with persistence

### Components
- `components/Flashcard/*.tsx` (10 components)
- `components/ui/Textarea.tsx` (new UI component)

### Pages
- `app/review/page.tsx`
- `app/review/decks/page.tsx`
- `app/review/decks/[deckId]/page.tsx`
- `app/review/decks/[deckId]/edit/page.tsx`
- `app/review/session/[deckId]/page.tsx`

### Data
- `data/sampleFlashcards.ts` - 3 sample decks with 15 cards

### Modified
- `components/ui/Badge.tsx` - Added variants
- `components/Navigation/Sidebar.tsx` - Added Flashcards link
