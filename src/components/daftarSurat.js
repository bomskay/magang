"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { supabase } from "@/supabaseClient";
import FormUpdateSurat from "./formUpdateSurat";
import DeleteSuratButton from "./deleteSuratButton";
import SearchBar from "./searchBar";




const DaftarSurat = () => {
const [suratMasuk, setSuratMasuk] = useState([]);
const [suratKeluar, setSuratKeluar] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedSurat, setSelectedSurat] = useState(null); // Untuk update surat
const [searchTerm, setSearchTerm] = useState("");

const filterSurat = (list) => {
  return list.filter((surat) =>
    [surat.jenis, surat.nomor, surat.perihal, surat.pengirim, surat.penerima, surat.timestamp?.toDate().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),]
      .some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
};


useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "surat"), async (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const suratMasukData = data.filter((surat) => surat.jenis === "masuk");
    const suratKeluarData = data.filter((surat) => surat.jenis === "keluar");

    const fetchFileUrl = async (filePath, folder) => {
      if (filePath.includes(`surat/${folder}`)) {
        filePath = filePath.replace(`surat/${folder}/`, "");
      }

      const { data: fileData, error } = await supabase.storage
        .from("surat-bucket")
        .getPublicUrl(`surat/${folder}/${filePath}`);

      if (error) {
        console.error("Gagal mendapatkan URL file:", error.message);
        return "";
      }

      return fileData.publicUrl;
    };

    const updatedSuratMasuk = await Promise.all(
      suratMasukData.map(async (surat) => {
        const fileUrl = await fetchFileUrl(surat.filePath, "masuk");
        return { ...surat, fileUrl };
      })
    );

    const updatedSuratKeluar = await Promise.all(
      suratKeluarData.map(async (surat) => {
        const fileUrl = await fetchFileUrl(surat.filePath, "keluar");
        return { ...surat, fileUrl };
      })
    );

    setSuratMasuk(updatedSuratMasuk);
    setSuratKeluar(updatedSuratKeluar);
    setLoading(false);
  });

  // Cleanup listener ketika komponen di-unmount
  return () => unsubscribe();
}, []);

  if (loading) {
    return <div className="text-center mt-10">Memuat data surat...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      {/* Surat Masuk */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Daftar Surat Masuk</h2>
      <table className="w-full border-collapse table-auto mb-10">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-2 px-4 border">Jenis</th>
            <th className="py-2 px-4 border">Nomor</th>
            <th className="py-2 px-4 border">Tanggal</th>
            <th className="py-2 px-4 border">Perihal</th>
            <th className="py-2 px-4 border">Pengirim</th>
            <th className="py-2 px-4 border">Penerima</th>
            <th className="py-2 px-4 border">File</th>
           
          </tr>
        </thead>
        <tbody>
        {filterSurat(suratMasuk).map((surat) => (
            <tr key={surat.id} className="text-center border-b hover:bg-gray-50">
              <td className="py-2 px-4 border">{surat.jenis}</td>
              <td className="py-2 px-4 border">{surat.nomor}</td>
              <td className="py-2 px-4 border"> {surat.timestamp?.toDate().toLocaleString("id-ID", {dateStyle: "medium",timeStyle: "short",})}</td>
              <td className="py-2 px-4 border">{surat.perihal}</td>
              <td className="py-2 px-4 border">{surat.pengirim}</td>
              <td className="py-2 px-4 border">{surat.penerima}</td>
              <td className="py-2 px-4 border text-left">
              <div className="flex items-center justify-center space-x-4">
                <a
                  href={surat.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Lihat File
                </a>
                <button
                  onClick={() => setSelectedSurat(surat)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <DeleteSuratButton
                  surat={surat}
                />
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Surat Keluar */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Daftar Surat Keluar</h2>
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-2 px-4 border">Jenis</th>
            <th className="py-2 px-4 border">Nomor</th>
            <th className="py-2 px-4 border">Tanggal</th>
            <th className="py-2 px-4 border">Perihal</th>
            <th className="py-2 px-4 border">Pengirim</th>
            <th className="py-2 px-4 border">Penerima</th>
            <th className="py-2 px-4 border">File</th>
          </tr>
        </thead>
        <tbody>
        {filterSurat(suratKeluar).map((surat) => (
            <tr key={surat.id} className="text-center border-b hover:bg-gray-50">
            <td className="py-2 px-4 border">{surat.jenis}</td>
            <td className="py-2 px-4 border">{surat.nomor}</td>
            <td className="py-2 px-4 border"> {surat.timestamp?.toDate().toLocaleString("id-ID", {dateStyle: "medium",timeStyle: "short",})}</td>
            <td className="py-2 px-4 border">{surat.perihal}</td>
            <td className="py-2 px-4 border">{surat.pengirim}</td>
            <td className="py-2 px-4 border">{surat.penerima}</td>
            <td className="py-2 px-4 border text-left">
            <div className="flex items-center justify-center space-x-4">
              <a
                href={surat.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Lihat File
              </a>
              <button
                onClick={() => setSelectedSurat(surat)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <DeleteSuratButton
                surat={surat}
              />
            </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>

      {/* Form Update Surat */}
      {selectedSurat && (
  <FormUpdateSurat
    surat={selectedSurat}
    onClose={() => setSelectedSurat(null)}
  />
)}
    </div>
  );
};

export default DaftarSurat;
