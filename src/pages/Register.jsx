import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Register() {
  const nav = useNavigate();
  const [mode, setMode] = useState("signup"); // 'signup' | 'login'
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, pass);
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
      nav("/report");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "signup" ? "Create account" : "Log in"}
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            className="w-full border p-3 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border p-3 rounded"
            placeholder="Password (min 6)"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button
            disabled={busy}
            className="w-full py-3 rounded bg-emerald-600 text-white"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>

        <div className="text-sm mt-3 text-center">
          {mode === "signup" ? (
            <button className="underline" onClick={() => setMode("login")}>
              Already have an account? Log in
            </button>
          ) : (
            <button className="underline" onClick={() => setMode("signup")}>
              New here? Create account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
