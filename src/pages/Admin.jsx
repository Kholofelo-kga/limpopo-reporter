import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection, onSnapshot, query, orderBy, updateDoc, doc
} from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths (so Vite shows markers)
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Admin() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    return onSnapshot(q, snap =>
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  async function setStatus(id, status) {
    await updateDoc(doc(db, "reports", id), { status });
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 p-4">
      {/* Map */}
      <div className="h-[70vh] border rounded overflow-hidden">
        <MapContainer center={[-23.9045, 29.4689]} zoom={11} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {rows.filter(r => r.geo).map(r => (
            <Marker key={r.id} position={[r.geo.lat, r.geo.lng]}>
              <Popup>
                <div className="space-y-1">
                  <img src={r.photoUrl} className="w-48 h-32 object-cover" />
                  <div className="font-semibold capitalize">{r.type} • {r.status}</div>
                  <div className="text-sm">{r.description}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="px-2 py-1 border rounded" onClick={() => setStatus(r.id, "assigned")}>Assign</button>
                    <button className="px-2 py-1 border rounded" onClick={() => setStatus(r.id, "in_progress")}>In progress</button>
                    <button className="px-2 py-1 border rounded" onClick={() => setStatus(r.id, "resolved")}>Resolve</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Table */}
      <div className="border rounded p-3 overflow-auto">
        <h3 className="font-semibold mb-2">Recent Reports</h3>
        <ul className="divide-y">
          {rows.map(r => (
            <li key={r.id} className="py-2 text-sm flex items-center gap-3">
              <img src={r.photoUrl} className="w-16 h-12 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium capitalize">{r.type} • {r.status}</div>
                <div className="text-slate-600">{r.description?.slice(0, 90)}</div>
              </div>
              <select
                value={r.status}
                onChange={e => setStatus(r.id, e.target.value)}
                className="border p-1 rounded"
              >
                <option>new</option>
                <option>assigned</option>
                <option>in_progress</option>
                <option>resolved</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
