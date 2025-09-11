// pages/DashboardPage.vue
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";

// Components
import DashboardHeader from "@/components/dashboard/DashboardHeader.vue";
import ImportExportSection from "@/components/dashboard/ImportExportSection.vue";
import StatsCards from "@/components/dashboard/StatsCards.vue";
import ChartsSection from "@/components/dashboard/ChartsSection.vue";
import ProgressSection from "@/components/dashboard/ProgressSection.vue";
import MiniAnalytics from "@/components/dashboard/MiniAnalytics.vue";
import WarningAlert from "@/components/dashboard/WarningAlert.vue";

// Composables
import { useFinanceData } from "@/composables/useFinanceData";
import { useDataImportExport } from "@/composables/useDataImportExport";

// Use composables
const {
  anggota,
  // setoran,
  pengeluaran,
  maksSetoranMingguan,
  maksSetoranOrang,
  totalPemasukan,
  totalPengeluaran,
  saldoSisa,
  jumlahMinggu,
  pengeluaranTerbaru,
  loadData,
  updateMaksSetoranMingguan,
  updateMaksSetoranOrang,
} = useFinanceData();

const { exportData, importData, exportCsv, importCsv } = useDataImportExport();

// Computed for current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

onMounted(() => {
  loadData();
});
</script>

<template>
  <Toaster position="top-right" />
  <div
    class="p-4 lg:p-6 space-y-4 lg:space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
  >
    <!-- Header Section -->
    <DashboardHeader :current-date="currentDate" />

    <!-- Import/Export Section -->
    <ImportExportSection
      @export-data="exportData"
      @import-data="importData"
      @export-csv="exportCsv"
      @import-csv="importCsv"
    />

    <!-- Warning Alert -->
    <WarningAlert />

    <!-- Stats Cards -->
    <StatsCards
      :total-pemasukan="totalPemasukan"
      :total-pengeluaran="totalPengeluaran"
      :saldo-sisa="saldoSisa"
      :jumlah-minggu="jumlahMinggu"
      :jumlah-anggota="anggota.length"
      :jumlah-transaksi="pengeluaran.length"
    />

    <!-- Charts Section -->
    <ChartsSection
      :anggota="anggota"
      :total-pemasukan="totalPemasukan"
      :total-pengeluaran="totalPengeluaran"
      :saldo-sisa="saldoSisa"
    />

    <!-- Progress and Recent Activities -->
    <ProgressSection
      :anggota="anggota"
      :pengeluaran-terbaru="pengeluaranTerbaru"
      :maks-setoran-mingguan="maksSetoranMingguan"
      :maks-setoran-orang="maksSetoranOrang"
      @update-maks-setoran-mingguan="updateMaksSetoranMingguan"
      @update-maks-setoran-orang="updateMaksSetoranOrang"
    />

    <!-- Mini Analytics Section -->
    <MiniAnalytics
      :total-pemasukan="totalPemasukan"
      :total-pengeluaran="totalPengeluaran"
      :jumlah-anggota="anggota.length"
      :jumlah-minggu="jumlahMinggu"
    />
  </div>
</template>
