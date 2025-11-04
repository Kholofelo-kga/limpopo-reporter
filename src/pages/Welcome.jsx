import { useNavigate } from "react-router-dom";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Welcome() {
  const nav = useNavigate();

  async function guest() {
    try {
      await signInAnonymously(auth);
      nav("/report");
    } catch (e) {
      alert("Guest sign-in failed: " + e.message);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold">Polokwane Service Reporter</h1>
        <p className="text-slate-600 mt-2">
          Report potholes, leaks, garbage and broken streetlights.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => nav("/register")}
            className="w-full py-3 rounded-xl bg-black text-white"
          >
            Create account
          </button>

          <button
            onClick={guest}
            className="w-full py-3 rounded-xl border"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
}
