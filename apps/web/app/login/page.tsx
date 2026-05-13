import { AuthModal } from "../../components/AuthModal";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <AuthModal mode="login" />
    </main>
  );
}
