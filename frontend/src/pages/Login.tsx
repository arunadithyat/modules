import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";

export function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError("Enter your email and password."); return; }
    setBusy(true); setError("");
    try { await signIn(email.trim(), password); }
    catch (err) { setError(err instanceof Error ? err.message : "Sign-in failed. Try again."); }
    finally { setBusy(false); }
  };

  return (
    <div className="login-wrap">
      <section className="login-intro">
        <div className="brand big">Automate<span>Genie</span></div>
        <h1>Your whole business, one calm place.</h1>
        <p>Sales, accounts, stock and your team, with Genie ready to help at every step.</p>
      </section>
      <form className="login-card" onSubmit={submit} noValidate>
        <h2>Sign in</h2>
        <label>Email
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="username" />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} autoComplete="current-password" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
