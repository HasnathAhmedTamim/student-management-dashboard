"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Toast } from "@/components/ui/Toast";

const FLASH_TOAST_KEY = "eduayna_flash_toast";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "success",
  );

  const dismissToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  async function handleLogout() {
    setLoading(true);
    setToastOpen(false);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (!response.ok) {
        setToastMessage("Unable to log out. Please try again.");
        setToastVariant("error");
        setToastOpen(true);
        return;
      }

      setToastMessage("Logged out successfully.");
      setToastVariant("success");
      setToastOpen(true);

      sessionStorage.setItem(
        FLASH_TOAST_KEY,
        JSON.stringify({
          message: "Logged out successfully.",
          variant: "success",
        }),
      );

      window.setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 700);
    } catch {
      setToastMessage("Unable to log out. Please try again.");
      setToastVariant("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        onClose={dismissToast}
      />
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
    </>
  );
}
