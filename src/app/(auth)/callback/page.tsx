'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        window.history.replaceState({}, '', window.location.pathname);
        router.push('/dashboard');
        return;
      }
    }

    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      fetch(`/api/auth/callback?code=${code}`).then(() => {
        router.push('/dashboard');
      });
      return;
    }

    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gray-50)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[var(--gray-400)]">جاري تسجيل الدخول...</span>
      </div>
    </div>
  );
}
