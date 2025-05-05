"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { supabase } from "@/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

const UpdateSurat = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [surat, setSurat] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSurat = async () => {
      const docRef = doc(db, "surat", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSurat(docSnap.data());
      } else {
        alert("Data surat tidak ditemukan.");
        router.push("/daftar-surat");
      }
    };

    fetchSurat();
  }, [id, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedData = {
        nomor: surat.nomor,
        tanggal: surat.tanggal,
        perihal: surat.perihal,
      };

      if (newFile) {
        const folder = surat.jenis === "masuk" ? "masuk" : "keluar";
        const oldFilePath = surat.filePath;

        // Hapus file lama (opsional)
        await supabase.storage
          .from("surat-bucket")
          .remove([`surat/${folder}/${oldFilePath}`]);

        // Upload file baru
        const newFileName = `${Date.now()}-${newFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("surat-bucket")
          .upload(`surat/${folder}/${newFileName}`, newFile, {
            upsert: true,
          });

        if (uploadError) throw uploadError;

        updatedData.filePath = newFileName;
      }

      await updateDoc(doc(db, "surat", id), updatedData);
      alert("Surat berhasil diperbarui.");
      router.push("/daftar-surat");
    } catch (error) {
      console.error("Gagal memperbarui surat:", error.message);
      alert("Terjadi kesalahan saat memperbarui surat.");
    } finally {
      setLoading(false);
    }
  };

  if (!surat) return <div>Memuat data surat...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Surat</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={surat.nomor}
          onChange={(e) => setSurat({ ...surat, nomor: e.target.value })}
          placeholder="Nomor Surat"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          value={surat.tanggal}
          onChange={(e) => setSurat({ ...surat, tanggal: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          value={surat.perihal}
          onChange={(e) => setSurat({ ...surat, perihal: e.target.value })}
          placeholder="Perihal"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setNewFile(e.target.files[0])}
          className="w-full border p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default UpdateSurat;
