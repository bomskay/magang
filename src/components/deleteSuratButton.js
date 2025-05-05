"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { supabase } from "@/supabaseClient";

const DeleteSuratButton = ({ surat, onSuccess }) => {
  const handleDelete = async () => {
    const konfirmasi = confirm("Yakin ingin menghapus surat ini?");
    if (!konfirmasi) return;

    try {
      // Hapus file dari Supabase Storage
      if (surat.filePath) {
        const { error: deleteError } = await supabase.storage
          .from("surat-bucket")
          .remove([surat.filePath]);

        if (deleteError) {
          console.warn("Gagal menghapus file di Supabase:", deleteError.message);
        }
      }

      // Hapus dokumen dari Firestore
      await deleteDoc(doc(db, "surat", surat.id));

      alert("Surat berhasil dihapus.");
      onSuccess(); // Refresh data
    } catch (error) {
      alert("Gagal menghapus surat: " + error.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline ml-2"
    >
      Hapus
    </button>
  );
};

export default DeleteSuratButton;
