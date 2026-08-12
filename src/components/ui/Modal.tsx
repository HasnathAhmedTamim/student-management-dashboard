"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * Called when the user asks to dismiss the dialog (Escape or overlay click).
   * Leave undefined to make the dialog non-dismissable, e.g. while saving.
   */
  onClose?: () => void;
  /**
   * Override overlay styling (position, dim level, z-index).
   * Example: "z-50 flex items-center justify-center bg-slate-900/50 p-4"
   */
  overlayClassName?: string;
  /**
   * Override card styling (max width/height, scrolling, padding).
   */
  cardClassName?: string;
}

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  overlayClassName,
  cardClassName,
}: ModalProps) {
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !onClose) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Move focus into the dialog and stop the page behind it from scrolling.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  const overlay =
    overlayClassName ??
    "z-40 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center";
  const card =
    `w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 outline-none ` +
    (cardClassName ?? "");

  return (
    <div
      className={`fixed inset-0 ${overlay}`}
      onClick={(event) => {
        // Only a click on the backdrop itself should dismiss the dialog.
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={card}
      >
        <h2
          id={titleId}
          className="mb-3 text-lg font-semibold text-slate-900"
        >
          {title}
        </h2>
        <div>{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
