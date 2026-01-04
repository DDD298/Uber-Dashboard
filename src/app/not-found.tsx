"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div suppressHydrationWarning>
      <div className="text-center mt-20" suppressHydrationWarning>
        <h1 className="text-3xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h1>
        <p className="text-[#909296] mb-4">Oops! Page not found.</p>
        <button
          className="bg-primary hover:bg-opacity-90 !text-emerald-50/80 px-4 py-2 rounded-lg"
          onClick={() => router.back()}
        >
          Return
        </button>
      </div>
    </div>
  );
}
