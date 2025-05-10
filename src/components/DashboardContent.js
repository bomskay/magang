"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const dashboarContent = () => {
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [suratTerbaru, setSuratTerbaru] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "surat"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let masuk = 0;
      let keluar = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.jenis === "masuk") masuk++;
        else if (data.jenis === "keluar") keluar++;
      });

      setTotalMasuk(masuk);
      setTotalKeluar(keluar);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "surat"), orderBy("timestamp", "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const latest = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuratTerbaru(latest);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Dashboard Surat</h1>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Surat Masuk</h2>
          <p className="text-2xl">{totalMasuk}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Surat Keluar</h2>
          <p className="text-2xl">{totalKeluar}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Surat</h2>
          <p className="text-2xl">{totalMasuk + totalKeluar}</p>
        </div>
      </div>

      {/* Daftar Surat Terbaru */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Surat Terbaru</h2>
        <ul className="space-y-3">
          {suratTerbaru.map((surat) => (
            <li
              key={surat.id}
              className="border p-3 rounded hover:bg-gray-50 flex justify-between"
            >
              <div>
                <p className="font-medium">{surat.nomor} – {surat.perihal}</p>
                <p className="text-sm text-gray-600">
                  {surat.jenis.toUpperCase()} |{" "}
                  {surat.timestamp?.toDate().toLocaleString("id-ID", {dateStyle: "medium",timeStyle: "short",})}
                </p>
              </div>
              <a
                href={surat.fileUrl}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat File
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default dashboarContent;
