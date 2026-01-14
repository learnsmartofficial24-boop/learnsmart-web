'use client';

import { useRouter } from 'next/navigation';
import { RootLayoutWrapper } from '@/components/Layout/RootLayoutWrapper';
import { DeckPreview } from '@/components/Flashcard/DeckPreview';
import { useParams } from 'next/navigation';

export default function DeckDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const handleStartReview = () => {
    router.push(`/review/session/${deckId}`);
  };

  const handleEditDeck = () => {
    // TODO: Implement edit deck page
    router.push(`/review/decks/${deckId}/edit`);
  };

  const handleBack = () => {
    router.push('/review/decks');
  };

  return (
    <RootLayoutWrapper>
      <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DeckPreview
            deckId={deckId}
            onStartReview={handleStartReview}
            onEditDeck={handleEditDeck}
            onBack={handleBack}
          />
        </div>
      </div>
    </RootLayoutWrapper>
  );
}
