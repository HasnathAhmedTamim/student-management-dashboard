/**
 * A "flash toast" is a message stored before a redirect (e.g. logout) and shown
 * on the next page, since toasts do not survive a navigation.
 */
const FLASH_TOAST_KEY = "eduayna_flash_toast";

export type FlashToast = {
  message: string;
  variant: "success" | "error" | "info";
};

export function setFlashToast(message: string, variant: FlashToast["variant"]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    FLASH_TOAST_KEY,
    JSON.stringify({ message, variant } satisfies FlashToast),
  );
}

export function consumeFlashToast(): FlashToast | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(FLASH_TOAST_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(FLASH_TOAST_KEY);
    return JSON.parse(raw) as FlashToast;
  } catch {
    sessionStorage.removeItem(FLASH_TOAST_KEY);
    return null;
  }
}
