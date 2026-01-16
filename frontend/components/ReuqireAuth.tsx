"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // prečíta token len na klientovi
  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [token, router, pathname]);

  // kým nemáme token, nič nerenderuj (nebude “bliknutie”)
  if (!token) return null;

  return <>{children}</>;
}
