import { ref } from "vue";
import type { Pengeluaran } from "@/types";
import { useJenisPengeluaran } from "@/composables/useJenisPengeluaran";

export const usePengeluaranData = () => {
  const { defaultJenisId } = useJenisPengeluaran();
  
  // Data state
  const pengeluaran = ref<Pengeluaran[]>([]);
  const showForm = ref(false);
  const editId = ref<string | null>(null);
  const editData = ref<Pengeluaran | null>(null);

  // File conversion utility
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Save data to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("pengeluaran", JSON.stringify(pengeluaran.value));
  };

  // Load data from localStorage
  const loadPengeluaran = () => {
    const savedPengeluaran = localStorage.getItem("pengeluaran");
    if (savedPengeluaran) {
      pengeluaran.value = JSON.parse(savedPengeluaran);

      // Migrate old data without jenisId
      let needsSave = false;
      pengeluaran.value.forEach((p) => {
        if (!p.jenisId) {
          p.jenisId = defaultJenisId.value;
          needsSave = true;
        }
      });

      if (needsSave) {
        saveToLocalStorage();
      }
    }
  };

  // Open form for add/edit
  const openForm = (item?: Pengeluaran) => {
    if (item) {
      editId.value = item.id;
      editData.value = item;
    } else {
      editId.value = null;
      editData.value = null;
    }
    showForm.value = true;
  };

  // Close form
  const closeForm = () => {
    showForm.value = false;
    editId.value = null;
    editData.value = null;
  };

  // Save pengeluaran
  const savePengeluaran = async (data: {
    tanggal: string;
    deskripsi: string;
    nominal: number;
    jenisId: string;
    buktiFile?: File | null;
  }) => {
    if (!data.deskripsi.trim() || data.nominal <= 0) return;

    let buktiBase64: string | undefined = undefined;
    if (data.buktiFile) {
      buktiBase64 = await fileToBase64(data.buktiFile);
    }

    if (editId.value) {
      // Edit mode
      const index = pengeluaran.value.findIndex((p) => p.id === editId.value);
      if (index !== -1) {
        pengeluaran.value[index] = {
          ...pengeluaran.value[index],
          tanggal: new Date(data.tanggal),
          deskripsi: data.deskripsi,
          nominal: data.nominal,
          jenisId: data.jenisId,
          bukti: buktiBase64 || pengeluaran.value[index].bukti,
        };
      }
    } else {
      // Add mode
      const pengeluaranBaru: Pengeluaran = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        tanggal: new Date(data.tanggal),
        deskripsi: data.deskripsi,
        nominal: data.nominal,
        jenisId: data.jenisId,
        bukti: buktiBase64,
      };
      pengeluaran.value.push(pengeluaranBaru);
    }

    saveToLocalStorage();
  };

  // Delete pengeluaran
  const deletePengeluaran = (id: string) => {
    pengeluaran.value = pengeluaran.value.filter((p) => p.id !== id);
    saveToLocalStorage();
  };

  return {
    pengeluaran,
    showForm,
    editId,
    editData,
    loadPengeluaran,
    savePengeluaran,
    deletePengeluaran,
    openForm,
    closeForm,
  };
};