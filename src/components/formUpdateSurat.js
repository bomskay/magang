"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { supabase } from "@/supabaseClient";

const FormUpdateSuratModal = ({ surat, onClose }) => {
  const [file, setFile] = useState(null);
  const [jenis, setJenis] = useState(surat?.jenis || "masuk");
  const [nomor, setNomor] = useState(surat?.nomor || "");
  const [tanggal, setTanggal] = useState(surat?.tanggal || "");
  const [pengirim, setPengirim] = useState(surat?.pengirim || "");
  const [penerima, setPenerima] = useState(surat?.penerima || "");
  const [perihal, setPerihal] = useState(surat?.perihal || "");
  const [existingFilePath, setExistingFilePath] = useState(surat?.filePath || "");

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose(); // tutup modal jika klik di luar area modal
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let filePath = existingFilePath;
    let fileUrl = surat.fileUrl;

    try {
      if (file) {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;
        const folder = jenis === "masuk" ? "masuk" : "keluar";
        filePath = `surat/${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("surat-bucket")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw new Error("Gagal upload file: " + uploadError.message);

        const { data: publicData, error: urlError } = supabase.storage
          .from("surat-bucket")
          .getPublicUrl(filePath);

        if (urlError || !publicData?.publicUrl) {
          throw new Error("Gagal mendapatkan URL file");
        }

        fileUrl = publicData.publicUrl;
      }

      await updateDoc(doc(db, "surat", surat.id), {
        jenis,
        nomor,
        tanggal,
        pengirim,
        penerima,
        perihal,
        filePath,
        fileUrl,
        timestamp: new Date(),
      });

      alert("Surat berhasil diperbarui!");
      onClose();
    } catch (err) {
      alert("Gagal memperbarui surat: " + err.message);
    }
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative z-10"
      >
        <h2 className="text-xl font-bold mb-4">Form Update Surat</h2>

        {/* Jenis Surat */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Jenis Surat</label>
          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="masuk">Surat Masuk</option>
            <option value="keluar">Surat Keluar</option>
          </select>
        </div>

        {/* Nomor */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Nomor Surat</label>
          <input
            type="text"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Tanggal */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Pengirim */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Pengirim</label>
          <input
            type="text"
            value={pengirim}
            onChange={(e) => setPengirim(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Penerima */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Penerima</label>
          <input
            type="text"
            value={penerima}
            onChange={(e) => setPenerima(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Perihal */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Perihal</label>
          <input
            type="text"
            value={perihal}
            onChange={(e) => setPerihal(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Ganti File (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
        </div>

        {/* Tombol */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormUpdateSuratModal;
