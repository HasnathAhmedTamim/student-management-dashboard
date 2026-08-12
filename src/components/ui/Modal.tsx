"use client";

import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
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
  overlayClassName,
  cardClassName,
}: ModalProps) {
  if (!open) return null;

  const overlay =
    overlayClassName ??
    "z-40 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center";
  const card =
    `w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 ` +
    (cardClassName ?? "");

  return (
    <div className={`fixed inset-0 ${overlay}`}>
      <div className={card}>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <div>{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}

