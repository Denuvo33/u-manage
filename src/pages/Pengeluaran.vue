<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PengeluaranHeader from "@/components/pengeluaran/PengeluaranHeader.vue";
import PengeluaranStats from "@/components/pengeluaran/PengeluaranStats.vue";
import PengeluaranFilters from "@/components/pengeluaran/PengeluaranFilters.vue";
import PengeluaranForm from "@/components/pengeluaran/PengeluaranForm.vue";
import PengeluaranList from "@/components/pengeluaran/PengeluaranList.vue";
import JenisDialog from "@/components/pengeluaran/JenisDialog.vue";
import FilterDialog from "@/components/pengeluaran/FilterDialog.vue";

import type { Pengeluaran } from "@/types";
import { useJenisPengeluaran } from "@/composables/useJenisPengeluaran";
import { usePengeluaranData } from "@/composables/usePengeluaranData";
import { usePengeluaranFilters } from "@/composables/usePengeluaranFilters";

// Composables
const { loadJenisPengeluaran, getJenisById, sortedJenis } =
  useJenisPengeluaran();
const {
  pengeluaran,
  showForm,
  editId,
  loadPengeluaran,
  savePengeluaran,
  deletePengeluaran,
  openForm,
  closeForm,
} = usePengeluaranData();

const {
  filters,
  filteredPengeluaran,
  hasActiveFilter,
  activeFilterCount,
  clearAllFilters,
  clearFilter,
} = usePengeluaranFilters(pengeluaran);

// Dialog states
const showJenisDialog = ref(false);

// Computed
const totalPengeluaran = computed(() => {
  return filteredPengeluaran.value.reduce(
    (sum: number, p: Pengeluaran) => sum + p.nominal,
    0
  );
});

const totalPengeluaranSemua = computed(() => {
  return pengeluaran.value.reduce(
    (sum: number, p: Pengeluaran) => sum + p.nominal,
    0
  );
});

// Load data on mount
onMounted(() => {
  loadJenisPengeluaran();
  loadPengeluaran();
});

// Event handlers
const handleTambahPengeluaran = () => {
  openForm();
};

const handleEditPengeluaran = (item: Pengeluaran) => {
  openForm(item);
};

const handleSavePengeluaran = async (data: any) => {
  await savePengeluaran(data);
  closeForm();
};

const handleDeletePengeluaran = (id: string) => {
  deletePengeluaran(id);
};
</script>

<template>
  <div class="p-6 space-y-6 max-w-full overflow-x-hidden">
    <!-- Header -->
    <PengeluaranHeader
      :show-jenis-dialog="showJenisDialog"
      @tambah-pengeluaran="handleTambahPengeluaran"
      @toggle-jenis-dialog="showJenisDialog = !showJenisDialog"
    >
      <template #filter-dialog>
        <FilterDialog
          :filters="filters"
          :sorted-jenis="sortedJenis"
          :get-jenis-by-id="getJenisById"
          :active-filter-count="activeFilterCount"
          @update:filters="filters = $event"
          @clear-all-filters="clearAllFilters"
        />
      </template>
    </PengeluaranHeader>

    <!-- Active Filters Display -->
    <PengeluaranFilters
      v-if="hasActiveFilter"
      :filters="filters"
      :active-filter-count="activeFilterCount"
      :get-jenis-by-id="getJenisById"
      @clear-filter="clearFilter"
      @clear-all-filters="clearAllFilters"
    />

    <!-- Statistics -->
    <PengeluaranStats
      :total-pengeluaran="totalPengeluaran"
      :get-jenis-by-id="getJenisById"
      :total-pengeluaran-semua="totalPengeluaranSemua"
      :filtered-pengeluaran="filteredPengeluaran"
      :pengeluaran="pengeluaran"
      :has-active-filter="hasActiveFilter"
      :filters="filters"
    />

    <!-- Form -->
    <PengeluaranForm
      v-if="showForm"
      :edit-id="editId"
      @save="handleSavePengeluaran"
      @cancel="closeForm"
    />

    <!-- List -->
    <PengeluaranList
      :pengeluaran="filteredPengeluaran"
      :total-count="pengeluaran.length"
      :has-active-filter="hasActiveFilter"
      :get-jenis-by-id="getJenisById"
      @edit="handleEditPengeluaran"
      @delete="handleDeletePengeluaran"
    />

    <!-- Jenis Dialog -->
    <JenisDialog
      v-model:open="showJenisDialog"
      :pengeluaran="pengeluaran"
      @update-pengeluaran="loadPengeluaran"
    />
  </div>
</template>
