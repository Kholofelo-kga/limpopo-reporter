import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  collection, query, where, orderBy, onSnapshot
} from "firebase/firestore";

export default function MyReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // Firestore: my reports, newest first
    const q = query(
      collection(db, "reports"),
      where("reporterUid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">My Reports</h2>

      {items.length === 0 ? (
        <p className="text-slate-600">No reports yet. Submit your first one on the Report page.</p>
      ) : (
        <ul className="divide-y">
          {items.map(r => (
            <li key={r.id} className="py-3 flex gap-3 items-start">
              <img src={r.photoUrl} className="w-24 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium capitalize">{r.type} • {r.status}</div>
                <div className="text-slate-600 text-sm">{r.description}</div>
                {r.geo && (
                  <div className="text-xs text-slate-500">
                    {r.geo.lat.toFixed(4)}, {r.geo.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
