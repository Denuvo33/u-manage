<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, PieChart, Users } from "lucide-vue-next";
import Chart from "chart.js/auto";
import type { Anggota } from "@/types";

interface Props {
  anggota: Anggota[];
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoSisa: number;
}

const props = defineProps<Props>();

// Chart refs
const financeChart = ref<HTMLCanvasElement | null>(null);
const memberChart = ref<HTMLCanvasElement | null>(null);
let financeChartInstance: Chart | null = null;
let memberChartInstance: Chart | null = null;

// Create finance overview chart
const createFinanceChart = () => {
  if (!financeChart.value) return;

  const ctx = financeChart.value.getContext("2d");
  if (!ctx) return;

  if (financeChartInstance) {
    financeChartInstance.destroy();
  }

  financeChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Pemasukan", "Pengeluaran", "Saldo"],
      datasets: [
        {
          label: "Amount (Rp)",
          data: [props.totalPemasukan, props.totalPengeluaran, props.saldoSisa],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(59, 130, 246, 0.8)",
          ],
          borderColor: [
            "rgba(34, 197, 94, 1)",
            "rgba(239, 68, 68, 1)",
            "rgba(59, 130, 246, 1)",
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          callbacks: {
            label: (context: any) => {
              return `Rp ${context.parsed.y.toLocaleString("id-ID")}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            callback: function (value: any) {
              return "Rp " + value.toLocaleString("id-ID");
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
};

// Create member distribution chart
const createMemberChart = () => {
  if (!memberChart.value || props.anggota.length === 0) return;

  const ctx = memberChart.value.getContext("2d");
  if (!ctx) return;

  if (memberChartInstance) {
    memberChartInstance.destroy();
  }

  // Generate colors for each member
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
    "#6366F1",
    "#84CC16",
  ];

  memberChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: props.anggota.map((member) => member.nama),
      datasets: [
        {
          data: props.anggota.map((member) => member.totalSetoran),
          backgroundColor: colors.slice(0, props.anggota.length),
          borderColor: colors.slice(0, props.anggota.length),
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: Rp ${context.parsed.toLocaleString(
                "id-ID"
              )} (${percentage}%)`;
            },
          },
        },
      },
      cutout: "50%",
    },
  });
};

// Update charts when data changes
const updateCharts = () => {
  nextTick(() => {
    createFinanceChart();
    createMemberChart();
  });
};

onMounted(() => {
  updateCharts();
});

watch(
  () => [
    props.anggota,
    props.totalPemasukan,
    props.totalPengeluaran,
    props.saldoSisa,
  ],
  () => {
    updateCharts();
  },
  { deep: true }
);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
    <!-- Financial Overview Chart -->
    <Card class="p-4 lg:p-6 bg-white shadow-sm border">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg font-semibold flex items-center gap-2">
          <BarChart3 class="w-5 h-5 text-blue-500" />
          Overview Keuangan
        </CardTitle>
        <CardDescription>
          Perbandingan pemasukan vs pengeluaran
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-64 lg:h-80">
          <canvas ref="financeChart"></canvas>
        </div>
      </CardContent>
    </Card>

    <!-- Member Progress Donut Chart -->
    <Card class="p-4 lg:p-6 bg-white shadow-sm border">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg font-semibold flex items-center gap-2">
          <PieChart class="w-5 h-5 text-green-500" />
          Distribusi Setoran Anggota
        </CardTitle>
        <CardDescription>Kontribusi setiap anggota</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-64 lg:h-80">
          <canvas ref="memberChart"></canvas>
        </div>
        <div
          v-if="anggota.length === 0"
          class="flex items-center justify-center h-64 lg:h-80 text-gray-400"
        >
          <div class="text-center">
            <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <span>Belum ada data anggota</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
