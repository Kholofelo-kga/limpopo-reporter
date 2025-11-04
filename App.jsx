import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";

export default function App() {
  return (
    <div className="p-4">
      <header className="flex items-center gap-3">
        <Link to="/">Home</Link>
        <Link to="/report">Report</Link>
        <Link to="/my">My Reports</Link>
        <Link to="/admin">Admin</Link>
        <button onClick={() => signOut(auth)} className="ml-auto px-2 border rounded">
          Sign out
        </button>
      </header>
      <div className="mt-6 text-slate-600">Use the links above.</div>
    </div>
  );
}
