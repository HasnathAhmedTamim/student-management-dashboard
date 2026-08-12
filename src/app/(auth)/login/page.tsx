import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Suspense fallback={<div className="text-slate-600">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
