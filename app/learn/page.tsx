'use client';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';

export default function LearnPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Learning Hub
        </h1>

        <Card padding="lg">
          <p className="text-[var(--foreground)] opacity-70">
            Learning pages coming soon in Phase 2...
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
