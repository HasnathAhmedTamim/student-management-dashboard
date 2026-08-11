"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      duration={3500}
      toastOptions={{
        classNames: {
          toast:
            "border shadow-lg font-sans !rounded-xl !text-sm",
          title: "!font-semibold",
          description: "!text-sm",
          closeButton: "!bg-white !border-slate-200",
        },
      }}
    />
  );
}
