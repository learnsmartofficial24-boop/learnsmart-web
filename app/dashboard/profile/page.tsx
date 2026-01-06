'use client';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Profile Settings
        </h1>

        <Card padding="lg">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] opacity-70">
                Name
              </label>
              <p className="text-[var(--foreground)]">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] opacity-70">
                Email
              </label>
              <p className="text-[var(--foreground)]">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] opacity-70">
                Theme
              </label>
              <p className="text-[var(--foreground)] capitalize">{user?.theme}</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
