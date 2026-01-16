"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const qs = searchParams?.toString();
      const fullPath = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/login?next=${encodeURIComponent(fullPath)}`);
      return;
    }

    // AI spravíme to async, aby to nebolo "synchronously within an effect"
    queueMicrotask(() => setCanRender(true));
    // alternatíva: setTimeout(() => setCanRender(true), 0);
  }, [router, pathname, searchParams]);

  if (!canRender) return null;

  return <>{children}</>;
}
