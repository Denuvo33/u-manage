import { createRouter, createWebHistory } from "vue-router";


import DashboardPage from "@/pages/Dashboard.vue";
import Anggota from "@/pages/Anggota.vue";
import Setoran from "@/pages/Setoran.vue";
import Pengeluaran from "@/pages/Pengeluaran.vue";


const routes = [
  { path: "/", redirect: "/dashboard" }, 
  { path: "/dashboard", component: DashboardPage },
  { path: "/anggota", component: Anggota },
  { path: "/setoran", component: Setoran },
  { path: "/pengeluaran", component: Pengeluaran },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
