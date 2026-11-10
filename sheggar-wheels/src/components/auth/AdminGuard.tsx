'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, hasRole } from '@/lib/auth';

export default function AdminGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace(
        `/signin?next=${encodeURIComponent(pathname || '/admin')}`
      );
      return;
    }

    if (!hasRole(user, 'admin')) {
      router.replace('/');
      return;
    }

    setAuthorized(true);
  }, [router, pathname]);

  if (!authorized) {
    return (
      <div className="p-20 text-center">
        Checking admin access...
      </div>
    );
  }

  return <>{children}</>;
}