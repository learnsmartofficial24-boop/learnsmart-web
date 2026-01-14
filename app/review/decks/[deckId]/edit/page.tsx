'use client';

import { useRouter, useParams } from 'next/navigation';
import { RootLayoutWrapper } from '@/components/Layout/RootLayoutWrapper';
import { DeckCreator } from '@/components/Flashcard/DeckCreator';

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const handleSave = () => {
    router.push(`/review/decks/${deckId}`);
  };

  const handleCancel = () => {
    router.push(`/review/decks/${deckId}`);
  };

  return (
    <RootLayoutWrapper>
      <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DeckCreator
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </RootLayoutWrapper>
  );
}
