import { createRouter, createWebHistory } from "vue-router";


import DashboardPage from "@/pages/Dashboard.vue";
import Anggota from "@/pages/Anggota.vue";
import Setoran from "@/pages/Setoran.vue";
import Pengeluaran from "@/pages/Pengeluaran.vue";


const routes = [
  { path: "/", redirect: "/dashboard" },
  {
    path: "/dashboard",
    component: DashboardPage,
    meta: {
      title: "Dashboard | U-Kelola",
      description: "Ringkasan keuangan kelompok, saldo, dan laporan mingguan."
    }
  },
  {
    path: "/anggota",
    component: Anggota,
    meta: {
      title: "Anggota | U-Kelola",
      description: "Kelola data anggota dan catatan setoran mingguan."
    }
  },
  {
    path: "/setoran",
    component: Setoran,
    meta: {
      title: "Setoran | U-Kelola",
      description: "Catat setoran mingguan untuk tiap anggota."
    }
  },
  {
    path: "/pengeluaran",
    component: Pengeluaran,
    meta: {
      title: "Pengeluaran | U-Kelola",
      description: "Catat pengeluaran dan laporan keuangan transparan."
    }
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
