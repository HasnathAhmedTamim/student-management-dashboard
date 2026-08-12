"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setFlashToast } from "@/lib/utils";
import { AUTH_MESSAGES } from "@/lib/messages";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (!response.ok) {
        toast.error(AUTH_MESSAGES.logoutFailed);
        return;
      }

      toast.success(AUTH_MESSAGES.loggedOut);
      setFlashToast(AUTH_MESSAGES.loggedOut, "success");

      window.setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 500);
    } catch {
      toast.error(AUTH_MESSAGES.logoutFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleLogout();
      }}
      disabled={loading}
      className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
