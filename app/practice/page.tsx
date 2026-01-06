'use client';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';

export default function PracticePage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Practice & Quizzes
        </h1>

        <Card padding="lg">
          <p className="text-[var(--foreground)] opacity-70">
            Practice pages coming soon in Phase 7...
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
