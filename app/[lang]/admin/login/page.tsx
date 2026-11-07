import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-sm bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Staff sign in</h1>
        <p className="mt-2 mb-6 text-sm text-ink-80">For DECMA Dental Clinic staff only.</p>
        <LoginForm />
      </div>
    </div>
  );
}
