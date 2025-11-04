import { useEffect, useState } from "react";
import { auth, db, storage } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Report() {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [loc, setLoc] = useState(null);
  const [busy, setBusy] = useState(false);

  // Get GPS location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: pos.coords.accuracy,
        });
      },
      (err) => {
        console.warn("GPS error:", err.message);
        setLoc(null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  async function submit() {
    if (!file) return alert("Please add a photo");
    if (!loc) return alert("Location not available yet—try again in a moment");

    try {
      setBusy(true);
      const uid = auth.currentUser?.uid || "anon";
      const stamp = Date.now();

      // 1) Upload image to Storage
      const sref = ref(storage, `reports/${uid}/${stamp}.jpg`);
      await uploadBytes(sref, file);
      const photoUrl = await getDownloadURL(sref);

      // 2) Create Firestore doc
      await addDoc(collection(db, "reports"), {
        createdAt: serverTimestamp(),
        status: "new",                 // new | assigned | in_progress | resolved
        type: "unknown",               // will add AI later
        description: desc,
        photoUrl,
        geo: { lat: loc.lat, lng: loc.lng, acc: loc.acc },
        reporterUid: uid,
        municipality: "Polokwane",
      });

      // 3) Reset form
      setFile(null);
      setDesc("");
      alert("Report submitted. Thank you!");
    } catch (e) {
      console.error(e);
      alert("Failed to submit: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-semibold">New Report</h2>

      <label className="block">
        <span className="text-sm text-slate-600">Photo</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full"
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-600">Description</span>
        <textarea
          className="mt-1 w-full border rounded p-2"
          placeholder="Describe the issue..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
        />
      </label>

      <div className="text-sm text-slate-500">
        Location:{" "}
        {loc
          ? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)} (±${Math.round(loc.acc)}m)`
          : "Detecting…"}
      </div>

      <button
        disabled={busy}
        onClick={submit}
        className="py-3 px-4 rounded bg-emerald-600 text-white disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Submit report"}
      </button>
    </div>
  );
}
