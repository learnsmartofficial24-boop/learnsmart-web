'use client';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';

export default function ClassesPage() {
  const { user } = useAuthStore();

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          My Classes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.subjects.map((subject) => (
            <Card key={subject} padding="lg" hover>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {subject}
                </h3>
                <Badge variant="info">Active</Badge>
              </div>
              <p className="text-[var(--foreground)] opacity-70 mb-4">
                Continue your learning journey in {subject}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--foreground)] opacity-70">
                    Progress
                  </span>
                  <span className="text-[var(--foreground)]">0%</span>
                </div>
                <div className="w-full bg-[var(--border)] rounded-full h-2">
                  <div
                    className="bg-[var(--primary)] h-2 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </Card>
          ))}
          
          {(!user?.subjects || user.subjects.length === 0) && (
            <Card padding="lg">
              <p className="text-[var(--foreground)] opacity-70">
                No subjects selected. Please complete your profile setup.
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
