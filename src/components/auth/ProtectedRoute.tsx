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

  // Auto-handle case: has token but no profile -> avoid infinite loading
  useEffect(() => {
    if (!isClient) return;

    // Only handle when profile loading is done but still no profile
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

  // Optimized loading states - reduced loading time by checking localStorage first
  if (!isClient) {
    // Check localStorage immediately for faster initial render
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile");
      const hasToken = localStorage.getItem("accessToken");

      if (storedProfile && hasToken) {
        // Return children immediately if we have stored auth data
        return <>{children}</>;
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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
