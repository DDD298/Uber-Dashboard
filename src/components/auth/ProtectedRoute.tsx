"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useUser } from "@/context/useUserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoadingProfile, profile } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!isLoadingProfile && !profile) {
      if (typeof window !== "undefined") {
        const hasAccessTokenLS =
          !!localStorage.getItem("accessToken") ||
          !!localStorage.getItem("token");
        const hasAccessTokenCookie =
          typeof document !== "undefined" &&
          document.cookie
            .split(";")
            .some((c) => c.trim().startsWith("accessToken="));

        // If still have token/cookie but no profile -> clear all and redirect to login
        if (hasAccessTokenLS || hasAccessTokenCookie) {
          try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("token");
            localStorage.removeItem("userProfile");
          } catch (e) {
            console.error("Failed to clear auth storage", e);
          }

          if (typeof document !== "undefined") {
            document.cookie =
              "accessToken=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }

          router.push("/admin/login");
        }
      }
    }
  }, [isClient, isLoadingProfile, profile, router]);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = () => {
      const hasToken =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      const hasProfile = localStorage.getItem("userProfile");

      if (!hasToken && !hasProfile && !isLoadingProfile) {
        router.push("/admin/login");
      }
    };

    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [isClient, isLoadingProfile, router]);

  if (!isClient) {
    return <>{children}</>;
  }

  // Client-side only checks below
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
