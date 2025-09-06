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
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Users,
  Wallet,
  FileText,
  FileDown,
  FileUp,
  FileJson,
  MessageCircleWarning,
} from "lucide-vue-next";
import type { Anggota, Setoran, Pengeluaran } from "@/types";
import { Input } from "@/components/ui/input";

// Data state
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

function updateMaksSetoranOrang() {
  const value = Number(maksSetoranOrang.value) || 0;
  localStorage.setItem("maksSetoranOrang", JSON.stringify(value));
  console.log("Maksimum setoran orang updated:", value);
}
const exportData = () => {
  const data = {
    anggota: JSON.parse(localStorage.getItem("anggota") || "[]"),
    setoran: JSON.parse(localStorage.getItem("setoran") || "[]"),
    pengeluaran: JSON.parse(localStorage.getItem("pengeluaran") || "[]"),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "kkn-data.json";
  link.click();
};

const importData = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const imported = JSON.parse(text);

    // ambil data lama
    const current = {
      anggota: JSON.parse(localStorage.getItem("anggota") || "[]"),
      setoran: JSON.parse(localStorage.getItem("setoran") || "[]"),
      pengeluaran: JSON.parse(localStorage.getItem("pengeluaran") || "[]"),
    };

    // gabungkan (merge by id supaya tidak duplikat)
    const merged = {
      anggota: mergeById(current.anggota, imported.anggota),
      setoran: mergeById(current.setoran, imported.setoran),
      pengeluaran: mergeById(current.pengeluaran, imported.pengeluaran),
    };

    // simpan hasil merge
    localStorage.setItem("anggota", JSON.stringify(merged.anggota));
    localStorage.setItem("setoran", JSON.stringify(merged.setoran));
    localStorage.setItem("pengeluaran", JSON.stringify(merged.pengeluaran));

    location.reload();
  };
  input.click();
};

function mergeById(existing: any[], incoming: any[]) {
  const map = new Map(existing.map((item) => [item.id, item]));
  incoming.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

function exportCsv() {
  const anggota = JSON.parse(localStorage.getItem("anggota") || "[]");
  const setoran = JSON.parse(localStorage.getItem("setoran") || "[]");
  const pengeluaran = JSON.parse(localStorage.getItem("pengeluaran") || "[]");

  // helper buat convert ke CSV
  const toCsv = (arr: any[]) => {
    if (arr.length === 0) return "";
    const headers = Object.keys(arr[0]);
    const rows = arr.map((obj) =>
      headers
        .map((h) => {
          let val = obj[h];
          if (h === "id" || h === "tanggal") {
            return `"${val}"`; // bungkus biar aman
          }
          return val;
        })
        .join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const saveFile = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  saveFile(toCsv(anggota), "anggota.csv");
  saveFile(toCsv(setoran), "setoran.csv");
  saveFile(toCsv(pengeluaran), "pengeluaran.csv");
}
function importCsv() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv";
  input.multiple = true; // bisa pilih beberapa file sekaligus
  input.onchange = async (e: any) => {
    const files: FileList = e.target.files;
    if (!files.length) return;

    const parseCsv = async (file: File) => {
      const text = await file.text();
      const [headerLine, ...lines] = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const headers = headerLine.split(",");
      return lines.map((line) => {
        const values = line.split(",").map((v) => v.replace(/^"|"$/g, "")); // hilangkan kutip
        const obj: any = {};
        headers.forEach((h, i) => {
          if (h === "nominal") {
            obj[h] = Number(values[i]) || 0;
          } else {
            obj[h] = values[i];
          }
        });
        return obj;
      });
    };

    const current = {
      anggota: JSON.parse(localStorage.getItem("anggota") || "[]"),
      setoran: JSON.parse(localStorage.getItem("setoran") || "[]"),
      pengeluaran: JSON.parse(localStorage.getItem("pengeluaran") || "[]"),
    };

    for (const file of Array.from(files)) {
      const parsed = await parseCsv(file);

      if (file.name.includes("anggota")) {
        current.anggota = mergeById(current.anggota, parsed);
      } else if (file.name.includes("setoran")) {
        current.setoran = mergeById(current.setoran, parsed);
      } else if (file.name.includes("pengeluaran")) {
        current.pengeluaran = mergeById(current.pengeluaran, parsed);
      }
    }

    localStorage.setItem("anggota", JSON.stringify(current.anggota));
    localStorage.setItem("setoran", JSON.stringify(current.setoran));
    localStorage.setItem("pengeluaran", JSON.stringify(current.pengeluaran));

    alert("Data CSV berhasil diimport & digabung!");
    location.reload();
  };
  input.click();
}

watch(maksSetoranMingguan, (val) => {
  const value = Number(val) || 0;
  localStorage.setItem("maksSetoranMingguan", JSON.stringify(value));
  console.log("Maksimum setoran mingguan updated:", value);
});

watch(maksSetoranOrang, (val) => {
  const value = Number(val) || 0;
  localStorage.setItem("maksSetoranOrang", JSON.stringify(value));
  console.log("Maksimum setoran orang updated:", value);
});
</script>

<template>
  <div class="p-6 space-y-2">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-muted-foreground">
        Ringkasan keuangan dan status setoran anggota
      </p>
    </div>

    <div class="space-y-4">
      <Card class="p-4 bg-white shadow-sm border">
        <h2 class="font-semibold text-lg mb-2">Import & Export Data</h2>
        <div class="flex gap-3 flex-wrap">
          <Button @click="importData" class="gap-2">
            <FileJson class="w-5 h-5" /> Import JSON
          </Button>
          <Button @click="exportData" class="gap-2">
            <FileJson class="w-5 h-5" /> Export JSON
          </Button>
          <Button @click="importCsv" class="gap-2">
            <FileDown class="w-5 h-5" /> Import CSV
          </Button>
          <Button @click="exportCsv" class="gap-2">
            <FileUp class="w-5 h-5" /> Export CSV
          </Button>
        </div>

        <div class="mt-4 space-y-2 text-sm text-gray-600">
          <p>
            <span class="font-medium">JSON</span> → menyimpan semua data dalam
            satu file yang mudah dibuka langsung di browser.
          </p>
          <p>
            <span class="font-medium">CSV</span> → diexport terpisah menjadi
            beberapa file. Untuk import ulang, semua file harus dimasukkan.
          </p>
        </div>
      </Card>

      <div
        class="p-3 rounded-md bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 text-yellow-800 flex items-start gap-2"
      >
        <MessageCircleWarning></MessageCircleWarning>
        <p class="text-sm">
          Pastikan selalu <b>membackup data</b> karena semua informasi hanya
          tersimpan secara lokal di browser.
        </p>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card
        class="bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg hover:scale-[1.02] transition-transform duration-200"
      >
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Pemasukan</CardTitle>
          <TrendingUp class="h-6 w-6 opacity-80" />
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-extrabold">
            Rp {{ totalPemasukan.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs opacity-80">Dari {{ jumlahMinggu }} minggu</p>
        </CardContent>
      </Card>

      <Card
        class="bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg hover:scale-[1.02] transition-transform duration-200"
      >
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Pengeluaran</CardTitle>
          <Wallet class="h-6 w-6 opacity-80" />
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-extrabold">
            Rp {{ totalPengeluaran.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs opacity-80">{{ pengeluaran.length }} transaksi</p>
        </CardContent>
      </Card>

      <Card
        class="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg hover:scale-[1.02] transition-transform duration-200"
      >
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Saldo Sisa</CardTitle>
          <FileText class="h-6 w-6 opacity-80" />
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-extrabold">
            Rp {{ saldoSisa.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs opacity-80">Tersedia untuk digunakan</p>
        </CardContent>
      </Card>

      <Card
        class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg hover:scale-[1.02] transition-transform duration-200"
      >
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Jumlah Anggota</CardTitle>
          <Users class="h-6 w-6 opacity-80" />
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-extrabold">{{ anggota.length }}</div>
          <p class="text-xs opacity-80">Aktif</p>
        </CardContent>
      </Card>
    </div>

    <!-- Progress and Recent Activities -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle class="text-lg font-semibold"
            >Status Setoran Minggu Ini</CardTitle
          >
          <CardDescription class="space-y-3">
            <div>
              <span class="text-sm font-medium">Setoran Maksimal Mingguan</span>
              <Input
                type="number"
                class="w-8/12 ml-2 mt-1"
                v-model.number="maksSetoranMingguan"
                @input="updateMaksSetoranMingguan"
              />
            </div>

            <div>
              <span class="text-sm font-medium"
                >Setoran Maksimal per Anggota</span
              >
              <Input
                type="number"
                class="w-8/12 ml-2 mt-1"
                v-model.number="maksSetoranOrang"
                @input="updateMaksSetoranOrang"
              />
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent class="pl-2">
          <div v-for="person in anggota" :key="person.id" class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium">{{ person.nama }}</span>
              <span class="text-sm font-semibold text-gray-600">
                Rp {{ person.totalSetoran.toLocaleString("id-ID") }}
              </span>
            </div>

            <Progress
              :model-value="
                (person.totalSetoran / (maksSetoranOrang ?? 1500000)) * 100
              "
              class="h-3 rounded-lg overflow-hidden"
              :class="{
                'bg-red-200 [&>div]:bg-red-500':
                  (person.totalSetoran / (maksSetoranOrang ?? 1500000)) * 100 <
                  40,
                'bg-yellow-200 [&>div]:bg-yellow-500':
                  (person.totalSetoran / (maksSetoranOrang ?? 1500000)) * 100 >=
                    40 &&
                  (person.totalSetoran / (maksSetoranOrang ?? 1500000)) * 100 <
                    80,
                'bg-green-200 [&>div]:bg-green-500':
                  (person.totalSetoran / (maksSetoranOrang ?? 1500000)) * 100 >=
                  80,
              }"
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
