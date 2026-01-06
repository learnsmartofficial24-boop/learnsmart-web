'use client';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const { user, toggleTheme } = useAuthStore();

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Settings
        </h1>

        <Card padding="lg">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--foreground)]">Theme</p>
              <p className="text-sm text-[var(--foreground)] opacity-70">
                Current theme: {user?.theme}
              </p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              Toggle Theme
            </Button>
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Account
          </h2>
          <p className="text-[var(--foreground)] opacity-70">
            Account management features coming soon...
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
