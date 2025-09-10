import { ref, computed } from "vue";
import type { Anggota, Setoran, Pengeluaran } from "@/types";

export const useFinanceData = () => {
  // Reactive data
  const anggota = ref<Anggota[]>([]);
  const setoran = ref<Setoran[]>([]);
  const pengeluaran = ref<Pengeluaran[]>([]);
  const maksSetoranMingguan = ref<number>(0);
  const maksSetoranOrang = ref<number>(0);

  // Computed properties
  const totalPemasukan = computed(() => {
    return setoran.value.reduce((sum, s) => sum + s.nominal, 0);
  });

  const totalPengeluaran = computed(() => {
    return pengeluaran.value.reduce((sum, p) => sum + p.nominal, 0);
  });

  const saldoSisa = computed(() => {
    return totalPemasukan.value - totalPengeluaran.value;
  });

  const jumlahMinggu = computed(() => {
    const mingguSet = new Set(setoran.value.map((s) => s.minggu));
    return mingguSet.size;
  });

  const pengeluaranTerbaru = computed(() => {
    return [...pengeluaran.value].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
  });

  // Methods
  const loadData = () => {
    const savedAnggota = localStorage.getItem("anggota");
    const savedSetoran = localStorage.getItem("setoran");
    const savedPengeluaran = localStorage.getItem("pengeluaran");
    const savedMaksSetoranMingguan = localStorage.getItem("maksSetoranMingguan");
    const savedMaksSetoranOrang = localStorage.getItem("maksSetoranOrang");

    if (savedAnggota) anggota.value = JSON.parse(savedAnggota);
    if (savedSetoran) setoran.value = JSON.parse(savedSetoran);
    if (savedPengeluaran) pengeluaran.value = JSON.parse(savedPengeluaran);
    if (savedMaksSetoranMingguan)
      maksSetoranMingguan.value = JSON.parse(savedMaksSetoranMingguan);
    if (savedMaksSetoranOrang)
      maksSetoranOrang.value = JSON.parse(savedMaksSetoranOrang);
  };

  const updateMaksSetoranMingguan = (value: number) => {
    maksSetoranMingguan.value = value;
    localStorage.setItem("maksSetoranMingguan", JSON.stringify(value));
  };

  const updateMaksSetoranOrang = (value: number) => {
    maksSetoranOrang.value = value;
    localStorage.setItem("maksSetoranOrang", JSON.stringify(value));
  };

  return {
    // Data
    anggota,
    setoran,
    pengeluaran,
    maksSetoranMingguan,
    maksSetoranOrang,
    // Computed
    totalPemasukan,
    totalPengeluaran,
    saldoSisa,
    jumlahMinggu,
    pengeluaranTerbaru,
    // Methods
    loadData,
    updateMaksSetoranMingguan,
    updateMaksSetoranOrang,
  };
};

