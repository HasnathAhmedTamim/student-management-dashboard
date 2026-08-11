"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Toast, type ToastVariant } from "@/components/ui/Toast";

const FLASH_TOAST_KEY = "eduayna_flash_toast";

type FlashToast = {
  message: string;
  variant: ToastVariant;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<ToastVariant>("info");

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }, []);

  const dismissToast = useCallback(() => {
    setToastOpen(false);
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(FLASH_TOAST_KEY);
      if (!raw) return;
      sessionStorage.removeItem(FLASH_TOAST_KEY);
      const flash = JSON.parse(raw) as FlashToast;
      if (flash?.message) {
        showToast(flash.message, flash.variant || "success");
      }
    } catch {
      sessionStorage.removeItem(FLASH_TOAST_KEY);
    }
  }, [showToast]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setToastOpen(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        showToast(
          body?.message || "Invalid username or password.",
          "error",
        );
        return;
      }

      showToast("Logged in successfully.", "success");
      window.setTimeout(() => {
        router.replace(nextPath);
        router.refresh();
      }, 700);
    } catch {
      showToast("Unable to log in. Please try again.", "error");
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

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          EduAyna
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Admin login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Demo credentials are prefilled. Change them via environment variables.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
