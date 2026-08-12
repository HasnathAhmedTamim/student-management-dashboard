"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { clearMessages } from "@/features/students/store/studentsSlice";

export function useStudentsToasts({
  successMessage,
  error,
  itemsLength,
}: {
  successMessage: string | null;
  error: string | null;
  itemsLength: number;
}) {
  const dispatch = useAppDispatch();
  const lastToastRef = useRef<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const key = `success:${successMessage}`;
      if (lastToastRef.current !== key) {
        lastToastRef.current = key;
        toast.success(successMessage);
      }
      dispatch(clearMessages());
      return;
    }

    // Keep behavior consistent with the previous dashboard:
    // show error toasts only when we already have some data.
    if (error && itemsLength > 0) {
      const key = `error:${error}`;
      if (lastToastRef.current !== key) {
        lastToastRef.current = key;
        toast.error(error);
      }
      dispatch(clearMessages());
    }
  }, [successMessage, error, itemsLength, dispatch]);
}

