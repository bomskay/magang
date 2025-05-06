"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { db } from "@/firebaseConfig";
import { setDoc, doc, collection, addDoc } from "firebase/firestore";

const FormInputSurat = () => {
  const [file, setFile] = useState(null);
  const [jenis, setJenis] = useState("masuk");
  const [nomor, setNomor] = useState("");
  const [pengirim, setPengirim] = useState("");
  const [penerima, setPenerima] = useState("");
  const [perihal, setPerihal] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Harap pilih file untuk diunggah.");
      return;
    }

    if (!nomor.trim()) {
      alert("Nomor surat wajib diisi.");
      return;
    }

    // Generate nama file unik
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;
    const folder = jenis.toLowerCase();
    const filePath = `surat/${folder}/${fileName}`;

    try {
      // Upload file ke Supabase
      const { error: uploadError } = await supabase.storage
        .from("surat-bucket")
        .upload(filePath, file);

      if (uploadError) throw new Error("Gagal meng-upload file: " + uploadError.message);

      // Ambil URL publik
      const { data: publicData, error: urlError } = supabase.storage
        .from("surat-bucket")
        .getPublicUrl(filePath);

      if (urlError || !publicData?.publicUrl) {
        throw new Error("Gagal mendapatkan URL publik file");
      }

      const fileUrl = publicData.publicUrl;

      // Simpan data ke Firestore
      const docId = nomor.replace(/\//g, "-");

      await addDoc(collection(db, "surat"), {
        jenis,
        nomor,
        tanggal: "2025-05-05", // bisa dijadikan input juga
        pengirim,
        penerima,
        perihal,
        filePath,
        fileUrl,
        timestamp: new Date(),
      });

      alert("Surat berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan surat: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">Form Input Surat</h2>

      {/* Jenis Surat */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Jenis Surat</label>
        <select
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <option value="masuk">Surat Masuk</option>
          <option value="keluar">Surat Keluar</option>
        </select>
      </div>

      {/* Nomor Surat */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Nomor Surat</label>
        <input
          type="text"
          value={nomor}
          onChange={(e) => setNomor(e.target.value)}
          required
          placeholder="Contoh: 001/SM/V/2025"
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Pengirim */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Pengirim</label>
        <input
          type="text"
          value={pengirim}
          onChange={(e) => setPengirim(e.target.value)}
          required
          placeholder=""
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Penerima */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Penerima</label>
        <input
          type="text"
          value={penerima}
          onChange={(e) => setPenerima(e.target.value)}
          required
          placeholder=""
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Perihal */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Penerihal</label>
        <input
          type="text"
          value={perihal}
          onChange={(e) => setPerihal(e.target.value)}
          required
          placeholder=""
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Upload File */}
      <div>
        <label className="block mb-1 text-gray-600 font-medium">Upload File (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Simpan Surat
      </button>
    </form>
  );
};

export default FormInputSurat;
