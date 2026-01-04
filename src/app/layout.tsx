import type { Metadata } from "next";
import "./globals.css";
import "./font.css";
import { ToastProvider } from "@/provider/ToastProvider";
import { ReactQueryClientProvider } from "@/provider/ReactQueryClientProvider";
import { UserProvider } from "@/context/useUserContext";

export const metadata: Metadata = {
  title: "Uber Admin Dashboard",
  description: "Admin dashboard for Uber Clone application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div
          className="bg-mainBackgroundV1 min-h-screen"
          suppressHydrationWarning
        >
          <ReactQueryClientProvider>
            <UserProvider>
              <ToastProvider />
              {children}
            </UserProvider>
          </ReactQueryClientProvider>
        </div>
      </body>
    </html>
  );
}
