// composables/useJenisPengeluaran.ts
import { ref, computed } from "vue";
import type { JenisPengeluaran } from "@/types";

export const useJenisPengeluaran = () => {
  const jenisPengeluaran = ref<JenisPengeluaran[]>([]);
  
  const colors = [
    "#EF4444", "#F97316", "#EAB308", "#22C55E", 
    "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899",
    "#F59E0B", "#10B981", "#6366F1", "#F43F5E"
  ];

  // Load data dari localStorage
  const loadJenisPengeluaran = () => {
    const saved = localStorage.getItem("jenisPengeluaran");
    if (saved) {
      jenisPengeluaran.value = JSON.parse(saved);
    } else {
      // Buat default jenis "Umum"
      const defaultJenis: JenisPengeluaran = {
        id: "default-umum-" + Date.now(),
        nama: "Umum",
        warna: "#6B7280",
        isDefault: true,
        createdAt: new Date()
      };
      jenisPengeluaran.value = [defaultJenis];
      saveJenisPengeluaran();
    }
  };

  // Save ke localStorage
  const saveJenisPengeluaran = () => {
    localStorage.setItem("jenisPengeluaran", JSON.stringify(jenisPengeluaran.value));
  };

  // Tambah jenis baru
  const tambahJenis = (nama: string, warna?: string) => {
    // Cek duplikasi nama
    const exists = jenisPengeluaran.value.find(
      j => j.nama.toLowerCase() === nama.toLowerCase()
    );
    if (exists) {
      throw new Error("Jenis pengeluaran sudah ada");
    }

    const jeniBaru: JenisPengeluaran = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      nama: nama.trim(),
      warna: warna || colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date(),
      isDefault: false
    };

    jenisPengeluaran.value.push(jeniBaru);
    saveJenisPengeluaran();
    return jeniBaru;
  };

  // Edit jenis
  const editJenis = (id: string, nama: string, warna: string) => {
    const index = jenisPengeluaran.value.findIndex(j => j.id === id);
    if (index === -1) {
      throw new Error("Jenis pengeluaran tidak ditemukan");
    }

    // Cek duplikasi nama (kecuali untuk item yang sedang diedit)
    const exists = jenisPengeluaran.value.find(
      j => j.nama.toLowerCase() === nama.toLowerCase() && j.id !== id
    );
    if (exists) {
      throw new Error("Jenis pengeluaran dengan nama tersebut sudah ada");
    }

    jenisPengeluaran.value[index] = {
      ...jenisPengeluaran.value[index],
      nama: nama.trim(),
      warna: warna
    };
    
    saveJenisPengeluaran();
  };

  // Hapus jenis (tidak bisa hapus yang default)
  const hapusJenis = (id: string) => {
    const jenis = jenisPengeluaran.value.find(j => j.id === id);
    if (jenis?.isDefault) {
      throw new Error("Jenis pengeluaran default tidak dapat dihapus");
    }

    jenisPengeluaran.value = jenisPengeluaran.value.filter(j => j.id !== id);
    saveJenisPengeluaran();
  };

  // Get jenis by ID
  const getJenisById = (id: string) => {
    return jenisPengeluaran.value.find(j => j.id === id);
  };

  // Get default jenis ID
  const defaultJenisId = computed(() => {
    return jenisPengeluaran.value.find(j => j.isDefault)?.id || 
           jenisPengeluaran.value[0]?.id || "";
  });

  // Sorted jenis (default first)
  const sortedJenis = computed(() => {
    return [...jenisPengeluaran.value].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.nama.localeCompare(b.nama);
    });
  });

  return {
    jenisPengeluaran,
    sortedJenis,
    defaultJenisId,
    colors,
    loadJenisPengeluaran,
    tambahJenis,
    editJenis,
    hapusJenis,
    getJenisById,
    saveJenisPengeluaran
  };
};