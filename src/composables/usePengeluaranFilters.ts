import { ref, computed, type Ref } from "vue";
import type { Pengeluaran } from "@/types";

export const usePengeluaranFilters = (pengeluaran: Ref<Pengeluaran[]>) => {
  // Filter state
  const filters = ref({
    jenisId: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    search: ""
  });

  // Computed filtered data
  const filteredPengeluaran = computed(() => {
    let filtered = [...pengeluaran.value];

    // Filter by jenis
    if (filters.value.jenisId) {
      filtered = filtered.filter((p) => p.jenisId === filters.value.jenisId);
    }

    // Filter by date range
    if (filters.value.tanggalMulai) {
      const startDate = new Date(filters.value.tanggalMulai);
      filtered = filtered.filter((p) => new Date(p.tanggal) >= startDate);
    }

    if (filters.value.tanggalSelesai) {
      const endDate = new Date(filters.value.tanggalSelesai);
      endDate.setHours(23, 59, 59, 999); // Include the whole day
      filtered = filtered.filter((p) => new Date(p.tanggal) <= endDate);
    }

    // Filter by search
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.deskripsi.toLowerCase().includes(searchTerm)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
  });

  // Check if any filter is active
  const hasActiveFilter = computed(() => {
    return !!(
      filters.value.jenisId ||
      filters.value.tanggalMulai ||
      filters.value.tanggalSelesai ||
      filters.value.search
    );
  });

  // Count active filters
  const activeFilterCount = computed(() => {
    let count = 0;
    if (filters.value.jenisId) count++;
    if (filters.value.tanggalMulai) count++;
    if (filters.value.tanggalSelesai) count++;
    if (filters.value.search) count++;
    return count;
  });

  // Clear all filters
  const clearAllFilters = () => {
    filters.value.jenisId = "";
    filters.value.tanggalMulai = "";
    filters.value.tanggalSelesai = "";
    filters.value.search = "";
  };

  // Clear specific filter
  const clearFilter = (type: string) => {
    switch (type) {
      case "jenis":
        filters.value.jenisId = "";
        break;
      case "tanggalMulai":
        filters.value.tanggalMulai = "";
        break;
      case "tanggalSelesai":
        filters.value.tanggalSelesai = "";
        break;
      case "search":
        filters.value.search = "";
        break;
    }
  };

  return {
    filters,
    filteredPengeluaran,
    hasActiveFilter,
    activeFilterCount,
    clearAllFilters,
    clearFilter,
  };
};