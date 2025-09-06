<!-- pages/DashboardPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Wallet, FileText } from "lucide-vue-next";
import type { Anggota, Setoran, Pengeluaran } from "@/types";
import { Input } from "@/components/ui/input";

// Data state
const anggota = ref<Anggota[]>([]);
const setoran = ref<Setoran[]>([]);
const pengeluaran = ref<Pengeluaran[]>([]);
const maksSetoranMingguan = ref<number | null>(null);
const maksSetoranOrang = ref<number | null>(null);

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

function updateMaksSetoranMingguan() {
  const value = Number(maksSetoranMingguan.value) || 0;
  localStorage.setItem("maksSetoranMingguan", JSON.stringify(value));
  console.log("Maksimum setoran mingguan updated:", value);
}

const pengeluaranTerbaru = computed(() => {
  return [...pengeluaran.value].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );
});

// Load data from localStorage
onMounted(() => {
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
});

function formatNumber(value: number | null): string {
  if (value === null || isNaN(value)) return "";
  return value.toLocaleString("id-ID");
}

function parseNumber(value: string): number | null {
  const plain = value.replace(/\./g, ""); // hapus titik pemisah
  const num = Number(plain);
  return isNaN(num) ? null : num;
}

const handleInputMingguan = (e: Event) => {
  const target = e.target as HTMLInputElement;
  maksSetoranMingguan.value = parseNumber(target.value);
  target.value = formatNumber(maksSetoranMingguan.value);
  updateMaksSetoranMingguan();
};

const handleInputOrang = (e: Event) => {
  const target = e.target as HTMLInputElement;
  maksSetoranOrang.value = parseNumber(target.value);
  target.value = formatNumber(maksSetoranOrang.value);
  updateMaksSetoranOrang();
};

function updateMaksSetoranOrang() {
  const value = Number(maksSetoranOrang.value) || 0;
  localStorage.setItem("maksSetoranOrang", JSON.stringify(value));
  console.log("Maksimum setoran orang updated:", value);
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-muted-foreground">
        Ringkasan keuangan dan status setoran anggota
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Pemasukan</CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp {{ totalPemasukan.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs text-muted-foreground">
            Dari {{ jumlahMinggu }} minggu
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Pengeluaran</CardTitle>
          <Wallet class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp {{ totalPengeluaran.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ pengeluaran.length }} transaksi
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Saldo Sisa</CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp {{ saldoSisa.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs text-muted-foreground">Tersedia untuk digunakan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Jumlah Anggota</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ anggota.length }}</div>
          <p class="text-xs text-muted-foreground">Aktif</p>
        </CardContent>
      </Card>
    </div>

    <!-- Progress and Recent Activities -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Status Setoran Minggu Ini</CardTitle>
          <CardDescription>
            <div>
              <span class="text-sm font-medium"
                >Atur jumlah setoran maksimal mingguan</span
              >
              <Input
                type="text"
                class="w-8/12 ml-2"
                :value="formatNumber(maksSetoranMingguan)"
                @input="handleInputMingguan"
              />
            </div>

            <div>
              <span class="text-sm font-medium"
                >Atur jumlah setoran maksimal per Anggota</span
              >
              <Input
                type="text"
                class="w-8/12 ml-2"
                :value="formatNumber(maksSetoranOrang)"
                @input="handleInputOrang"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent class="pl-2">
          <div v-for="person in anggota" :key="person.id" class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium">{{ person.nama }}</span>
              <span class="text-sm text-muted-foreground"
                >Rp {{ person.totalSetoran.toLocaleString("id-ID") }}</span
              >
            </div>
            <Progress
              :model-value="
                (person.totalSetoran / (maksSetoranOrang ?? 1500000)) * 100
              "
              class="h-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Pengeluaran Terbaru</CardTitle>
          <CardDescription>5 transaksi terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="item in pengeluaranTerbaru.slice(0, 5)"
              :key="item.id"
              class="flex items-center"
            >
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">
                  {{ item.deskripsi }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ new Date(item.tanggal).toLocaleDateString("id-ID") }}
                </p>
              </div>
              <div class="ml-auto font-medium text-destructive">
                -Rp {{ item.nominal.toLocaleString("id-ID") }}
              </div>
            </div>
            <div
              v-if="pengeluaran.length === 0"
              class="text-center text-muted-foreground py-4"
            >
              Belum ada pengeluaran
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
