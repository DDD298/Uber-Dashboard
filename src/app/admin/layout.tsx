"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layout/DashboardLayout";

const ProtectedRoute = dynamic(
  () => import("@/components/auth/ProtectedRoute"),
  { ssr: false }
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div suppressHydrationWarning>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute>
          <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
      )}
    </div>
  );
}
