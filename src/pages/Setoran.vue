<!-- pages/SetoranPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Plus, Save, Trash2 } from "lucide-vue-next";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Anggota, Setoran } from "@/types";

// Data state
const anggota = ref<Anggota[]>([]);
const setoran = ref<Setoran[]>([]);
const mingguKe = ref<string>("1");
const tanggalSetoran = ref<string>("");
const showForm = ref(false);

// Form state
const selectedAnggota = ref<string>("");
const nominalSetoran = ref<number>(
  Number(localStorage.getItem("maksSetoranMingguan")) || 0
);
const jenisSetoran = ref<"full" | "partial" | "full_all">("full");
const jumlahMingguBayar = ref<number>(12); // Default 12 minggu

// Loading state
const isLoading = ref(true);

// Config - bisa dipindah ke settings
const TOTAL_MINGGU_SEMESTER = 12; // Total minggu dalam 1 semester
const NOMINAL_PER_MINGGU = ref<number>(100000);

// Initialize component
onMounted(async () => {
  console.log("Component mounted, loading data...");
  tanggalSetoran.value = new Date().toISOString().split("T")[0];
  await loadData();
  console.log("Loaded anggota:", anggota.value);
  console.log("Loaded setoran:", setoran.value);
  isLoading.value = false;
});

// Load data function
const loadData = async () => {
  try {
    const savedAnggota = localStorage.getItem("anggota");
    const savedSetoran = localStorage.getItem("setoran");
    const savedMaksSetoranMingguan = localStorage.getItem(
      "maksSetoranMingguan"
    );

    if (savedMaksSetoranMingguan) {
      NOMINAL_PER_MINGGU.value = JSON.parse(savedMaksSetoranMingguan);
      nominalSetoran.value = NOMINAL_PER_MINGGU.value;
    }
    if (savedAnggota) {
      const parsedAnggota = JSON.parse(savedAnggota);
      anggota.value = parsedAnggota.map((a: any) => ({
        ...a,
        createdAt:
          typeof a.createdAt === "string" ? new Date(a.createdAt) : a.createdAt,
      }));
    }

    if (savedSetoran) {
      const parsedSetoran = JSON.parse(savedSetoran);
      setoran.value = parsedSetoran.map((s: any) => ({
        ...s,
        tanggal:
          typeof s.tanggal === "string" ? new Date(s.tanggal) : s.tanggal,
      }));
    }

    console.log("Data loaded successfully");
    console.log("Anggota count:", anggota.value.length);
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

// Computed properties
const mingguKeNumber = computed(() => parseInt(mingguKe.value));

// Fix: Allow up to TOTAL_MINGGU_SEMESTER regardless of existing setoran
const jumlahMinggu = computed(() => {
  return TOTAL_MINGGU_SEMESTER;
});

const setoranMingguIni = computed(() => {
  return setoran.value.filter((s) => s.minggu === mingguKeNumber.value);
});

const totalSetoranMingguIni = computed(() => {
  return setoranMingguIni.value.reduce((sum, s) => sum + s.nominal, 0);
});

// Enhanced: Check if anggota sudah bayar untuk minggu tertentu
const anggotaSudahBayarMingguIni = computed(() => {
  return new Set(setoranMingguIni.value.map((s) => s.anggotaId));
});

const anggotaBelumSetor = computed(() => {
  return anggota.value.filter(
    (a) => !anggotaSudahBayarMingguIni.value.has(a.id)
  );
});

// Check anggota yang sudah bayar full (untuk semua minggu)
const anggotaSudahBayarFull = computed(() => {
  const anggotaFullPaid = new Set<string>();

  anggota.value.forEach((anggota) => {
    let sudahBayarSemuaMinggu = true;

    // Check apakah anggota ini sudah bayar untuk semua minggu 1-12
    for (let minggu = 1; minggu <= TOTAL_MINGGU_SEMESTER; minggu++) {
      const sudahBayarMingguIni = setoran.value.some(
        (s) => s.anggotaId === anggota.id && s.minggu === minggu
      );

      if (!sudahBayarMingguIni) {
        sudahBayarSemuaMinggu = false;
        break;
      }
    }

    if (sudahBayarSemuaMinggu) {
      anggotaFullPaid.add(anggota.id);
    }
  });

  return anggotaFullPaid;
});

function hitungNominal() {
  nominalSetoran.value = NOMINAL_PER_MINGGU.value;
  localStorage.setItem(
    "maksSetoranMingguan",
    JSON.stringify(NOMINAL_PER_MINGGU.value)
  );
}

const canAddSetoran = computed(() => {
  const result = anggota.value.length > 0;
  console.log(
    "Can add setoran:",
    result,
    "Anggota length:",
    anggota.value.length
  );
  return result;
});

// Save data to localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem("setoran", JSON.stringify(setoran.value));

    const updatedAnggota = anggota.value.map((a) => {
      const total = setoran.value
        .filter((s) => s.anggotaId === a.id)
        .reduce((sum, s) => sum + s.nominal, 0);

      return { ...a, totalSetoran: total };
    });

    anggota.value = updatedAnggota;
    localStorage.setItem("anggota", JSON.stringify(updatedAnggota));

    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// Handle form operations
const openTambahSetoran = () => {
  console.log("Opening tambah setoran form");
  console.log("Available anggota:", anggota.value.length);

  if (anggota.value.length === 0) {
    alert(
      "Belum ada anggota yang terdaftar. Silakan tambahkan anggota terlebih dahulu."
    );
    return;
  }

  selectedAnggota.value = "";
  nominalSetoran.value = 0;
  jenisSetoran.value = "full";
  jumlahMingguBayar.value = 12;
  showForm.value = true;
};

const simpanSetoran = () => {
  if (!selectedAnggota.value) {
    alert("Pilih anggota terlebih dahulu");
    return;
  }

  const anggotaTerpilih = anggota.value.find(
    (a) => a.id === selectedAnggota.value
  );
  if (!anggotaTerpilih) {
    alert("Anggota tidak ditemukan");
    return;
  }

  if (jenisSetoran.value === "full_all") {
    // Bayar untuk beberapa minggu sekaligus
    console.log("Simpan setoran full all");
    simpanSetoranFullAll();
  } else {
    // Bayar untuk minggu ini saja
    simpanSetoranSingle();
  }
};

const simpanSetoranSingle = () => {
  // Check if already deposited this week
  const sudahSetor = setoranMingguIni.value.some(
    (s) => s.anggotaId === selectedAnggota.value
  );
  if (sudahSetor) {
    alert("Anggota ini sudah melakukan setoran untuk minggu ini");
    return;
  }

  const nominal =
    jenisSetoran.value === "full"
      ? NOMINAL_PER_MINGGU.value
      : nominalSetoran.value;

  if (nominal <= 0) {
    alert("Nominal setoran harus lebih dari 0");
    return;
  }

  const setoranBaru: Setoran = {
    id: Date.now().toString(),
    anggotaId: selectedAnggota.value,
    minggu: mingguKeNumber.value,
    nominal: nominal,
    tanggal: new Date(tanggalSetoran.value),
    jenis: jenisSetoran.value,
  };

  setoran.value.push(setoranBaru);
  saveToLocalStorage();
  console.log("Single setoran saved:", setoranBaru);
  showForm.value = false;
};

const simpanSetoranFullAll = () => {
  const groupId = `group_${Date.now()}_${selectedAnggota.value}`; // id unik utk grup

  const setoranBaru: Setoran[] = [];
  const startMinggu = mingguKeNumber.value;

  for (let i = 0; i < jumlahMingguBayar.value; i++) {
    const mingguTarget = startMinggu + i;
    if (mingguTarget > TOTAL_MINGGU_SEMESTER) break;

    const sudahBayar = setoran.value.some(
      (s) => s.anggotaId === selectedAnggota.value && s.minggu === mingguTarget
    );
    if (sudahBayar) continue;

    setoranBaru.push({
      id: `${Date.now()}_${i}`,
      anggotaId: selectedAnggota.value,
      minggu: mingguTarget,
      nominal: NOMINAL_PER_MINGGU.value,
      tanggal: new Date(tanggalSetoran.value),
      jenis: jenisSetoran.value,
      groupId,
    });
  }

  if (setoranBaru.length === 0) return;

  setoran.value.push(...setoranBaru);
  saveToLocalStorage();
  showForm.value = false;
};

const hapusSetoran = (id: string) => {
  const target = setoran.value.find((s) => s.id === id);

  if (!target) return;

  if (target.groupId) {
    setoran.value = setoran.value.filter((s) => s.groupId !== target.groupId);
  } else {
    setoran.value = setoran.value.filter((s) => s.id !== id);
  }

  saveToLocalStorage();
};

watch(jenisSetoran, (newJenis) => {
  if (newJenis === "full") {
    nominalSetoran.value = NOMINAL_PER_MINGGU.value;
  } else if (newJenis === "full_all") {
    nominalSetoran.value = NOMINAL_PER_MINGGU.value * jumlahMingguBayar.value;
  } else {
    nominalSetoran.value = 0;
  }
});

// Watch jumlahMingguBayar change
watch(jumlahMingguBayar, (newJumlah) => {
  if (jenisSetoran.value === "full_all") {
    nominalSetoran.value = NOMINAL_PER_MINGGU.value * newJumlah;
  }
});

// Watch for route changes to reload data
watch(
  () => anggota.value.length,
  (newLength, oldLength) => {
    console.log(`Anggota count changed from ${oldLength} to ${newLength}`);
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
    <!-- Header -->
    <div
      class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start"
    >
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight truncate">
          Setoran Mingguan
        </h1>
        <p class="text-sm sm:text-base text-muted-foreground mt-1">
          Kelola setoran anggota per minggu (Total:
          {{ TOTAL_MINGGU_SEMESTER }} minggu)
        </p>
      </div>
      <Button
        @click="openTambahSetoran"
        :disabled="!canAddSetoran || isLoading"
        class="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4 flex-shrink-0"
      >
        <Plus class="h-4 w-4 mr-2" />
        Tambah Setoran
      </Button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <p>Loading data...</p>
    </div>

    <!-- No members warning -->
    <Card v-if="!isLoading && anggota.length === 0" class="w-full">
      <CardContent class="pt-6">
        <div class="text-center py-8">
          <p class="text-muted-foreground mb-4">
            Belum ada anggota yang terdaftar
          </p>
          <Button variant="outline" @click="$router.push('/anggota')">
            Tambah Anggota
          </Button>
        </div>
      </CardContent>
    </Card>

    <template v-if="!isLoading && anggota.length > 0">
      <!-- Minggu Selection -->
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="text-lg sm:text-xl">Pilih Minggu</CardTitle>
          <CardDescription class="text-sm">
            Pilih minggu keberapa untuk melihat atau menambah setoran (1 -
            {{ TOTAL_MINGGU_SEMESTER }})
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-col gap-4 sm:flex-row">
            <div class="flex-1 min-w-0">
              <Label for="minggu" class="text-sm font-medium">Minggu Ke-</Label>
              <Select v-model="mingguKe" class="w-full">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Pilih minggu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="i in jumlahMinggu"
                    :key="i"
                    :value="i.toString()"
                  >
                    Minggu Ke-{{ i }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex-1 min-w-0">
              <Label class="text-sm font-medium">Tanggal Setoran</Label>
              <Input
                type="date"
                class="w-full"
                v-model="tanggalSetoran"
                :max="new Date().toISOString().split('T')[0]"
              />
            </div>
          </div>

          <div
            class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center pt-4 border-t"
          >
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-semibold">
                Total Setoran Minggu Ini
              </h3>
              <p class="text-xl sm:text-2xl font-bold text-green-600">
                Rp {{ totalSetoranMingguIni.toLocaleString("id-ID") }}
              </p>
            </div>
            <div class="text-left sm:text-right flex-shrink-0">
              <p class="text-xs sm:text-sm text-muted-foreground">
                {{ setoranMingguIni.length }} dari {{ anggota.length }} anggota
              </p>
              <p
                class="text-xs sm:text-sm"
                :class="
                  anggotaBelumSetor.length > 0
                    ? 'text-amber-600'
                    : 'text-green-600'
                "
              >
                {{ anggotaBelumSetor.length }} anggota belum setor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Form Tambah Setoran -->
      <Card v-if="showForm" class="w-full">
        <CardHeader>
          <CardTitle class="text-lg sm:text-xl">Tambah Setoran</CardTitle>
          <CardDescription class="text-sm">
            Tambahkan setoran untuk minggu ke-{{ mingguKeNumber }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2 min-w-0">
              <Label for="anggota" class="text-sm font-medium">Anggota</Label>
              <Select v-model="selectedAnggota" class="w-full">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="person in anggota"
                    :key="person.id"
                    :value="person.id"
                  >
                    <div class="flex items-center justify-between w-full">
                      <span class="truncate">{{ person.nama }}</span>
                      <span
                        v-if="anggotaSudahBayarFull.has(person.id)"
                        class="text-green-600 text-xs ml-2 flex-shrink-0"
                      >
                        (Full)
                      </span>
                      <span
                        v-else-if="anggotaSudahBayarMingguIni.has(person.id)"
                        class="text-amber-600 text-xs ml-2 flex-shrink-0"
                      >
                        (Paid)
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2 min-w-0">
              <Label for="jenis" class="text-sm font-medium"
                >Jenis Setoran</Label
              >
              <Select v-model="jenisSetoran" class="w-full">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Pilih jenis setoran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Setoran Penuh</SelectItem>
                  <SelectItem value="partial">Setoran Sebagian</SelectItem>
                  <SelectItem value="full_all">Bayar Multi-Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Input nominal untuk partial -->
          <div class="space-y-2" v-if="jenisSetoran === 'partial'">
            <Label for="nominal" class="text-sm font-medium"
              >Nominal Setoran</Label
            >
            <Input
              type="number"
              placeholder="Masukkan nominal setoran"
              v-model.number="nominalSetoran"
              class="w-full"
            />
          </div>

          <!-- Input jumlah minggu untuk full_all -->
          <div class="space-y-2" v-if="jenisSetoran === 'full_all'">
            <Label for="jumlahMinggu" class="text-sm font-medium"
              >Bayar Untuk Berapa Minggu?</Label
            >
            <Input
              id="jumlahMinggu"
              type="number"
              :min="1"
              :max="TOTAL_MINGGU_SEMESTER - mingguKeNumber + 1"
              v-model="jumlahMingguBayar"
              class="w-full"
            />

            <p class="text-sm text-gray-600">
              Mulai dari minggu {{ mingguKeNumber }} sampai minggu
              {{
                Math.min(
                  mingguKeNumber + jumlahMingguBayar - 1,
                  TOTAL_MINGGU_SEMESTER
                )
              }}
            </p>
            <Label class="text-sm font-medium">Harga bayar per minggu</Label>
            <Input
              type="number"
              :min="1"
              @input="hitungNominal"
              v-model="NOMINAL_PER_MINGGU"
              class="w-full"
            />
          </div>

          <!-- Info nominal -->
          <div class="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
            <div v-if="jenisSetoran === 'full'">
              Nominal setoran penuh: Rp
              {{ NOMINAL_PER_MINGGU.toLocaleString("id-ID") }}
            </div>
            <div v-if="jenisSetoran === 'full_all'">
              <div>
                Total nominal: Rp
                {{
                  (NOMINAL_PER_MINGGU * jumlahMingguBayar).toLocaleString(
                    "id-ID"
                  )
                }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ jumlahMingguBayar }} minggu × Rp
                {{ NOMINAL_PER_MINGGU.toLocaleString("id-ID") }}
              </div>
            </div>
          </div>

          <div
            class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-2 pt-4 border-t"
          >
            <Button
              variant="outline"
              @click="showForm = false"
              class="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              @click="simpanSetoran"
              :disabled="!selectedAnggota"
              class="w-full sm:w-auto"
            >
              <Save class="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Daftar Setoran Minggu Ini -->
      <Card class="w-full">
        <CardHeader>
          <CardTitle class="text-lg sm:text-xl"
            >Setoran Minggu Ke-{{ mingguKeNumber }}</CardTitle
          >
          <CardDescription class="text-sm">
            Daftar setoran anggota untuk minggu ini
          </CardDescription>
        </CardHeader>
        <CardContent class="p-0 sm:p-6">
          <!-- Mobile View -->
          <div class="block sm:hidden">
            <div
              v-if="setoranMingguIni.length === 0"
              class="text-center py-8 text-muted-foreground px-6"
            >
              Belum ada setoran untuk minggu ke-{{ mingguKeNumber }}
            </div>
            <div v-else class="divide-y divide-gray-200">
              <div
                v-for="item in setoranMingguIni"
                :key="item.id"
                class="p-4 space-y-2"
              >
                <div class="flex justify-between items-start">
                  <div class="min-w-0 flex-1">
                    <h4 class="font-medium truncate">
                      {{
                        anggota.find((a) => a.id === item.anggotaId)?.nama ||
                        "Unknown"
                      }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      {{
                        format(new Date(item.tanggal), "dd MMM yyyy", {
                          locale: id,
                        })
                      }}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger
                      class="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 class="h-4 w-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle
                          >Apakah yakin ingin menghapusnya?</AlertDialogTitle
                        >
                        <AlertDialogDescription>
                          Setoran Anggota ini akan dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction @click="hapusSetoran(item.id)">
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div class="flex justify-between items-center">
                  <span
                    :class="
                      item.jenis === 'full'
                        ? 'text-blue-600 bg-blue-50'
                        : item.jenis === 'partial'
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-green-600 bg-green-50'
                    "
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{
                      item.jenis === "full"
                        ? "Penuh"
                        : item.jenis === "partial"
                        ? "Sebagian"
                        : "Lunas"
                    }}
                  </span>
                  <span class="font-semibold text-green-600">
                    Rp {{ item.nominal.toLocaleString("id-ID") }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop View -->
          <div class="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="min-w-[120px]">Nama Anggota</TableHead>
                  <TableHead class="min-w-[100px]">Tanggal</TableHead>
                  <TableHead class="min-w-[80px]">Jenis</TableHead>
                  <TableHead class="min-w-[100px]">Nominal</TableHead>
                  <TableHead class="text-right min-w-[60px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in setoranMingguIni" :key="item.id">
                  <TableCell class="font-medium">
                    {{
                      anggota.find((a) => a.id === item.anggotaId)?.nama ||
                      "Unknown"
                    }}
                  </TableCell>
                  <TableCell>
                    {{
                      format(new Date(item.tanggal), "dd MMM yyyy", {
                        locale: id,
                      })
                    }}
                  </TableCell>
                  <TableCell>
                    <span
                      :class="
                        item.jenis === 'full'
                          ? 'text-blue-600'
                          : item.jenis === 'partial'
                          ? 'text-amber-600'
                          : 'text-green-600'
                      "
                    >
                      {{
                        item.jenis === "full"
                          ? "Penuh"
                          : item.jenis === "partial"
                          ? "Sebagian"
                          : "Lunas"
                      }}
                    </span>
                  </TableCell>
                  <TableCell
                    >Rp {{ item.nominal.toLocaleString("id-ID") }}</TableCell
                  >
                  <TableCell class="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Trash2
                          class="h-4 w-4 text-red-500 hover:text-red-700"
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle
                            >Apakah yakin ingin menghapusnya?</AlertDialogTitle
                          >
                          <AlertDialogDescription>
                            Setoran Anggota ini akan dihapus secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction @click="hapusSetoran(item.id)">
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
                <TableRow v-if="setoranMingguIni.length === 0">
                  <TableCell
                    colspan="5"
                    class="text-center py-4 text-muted-foreground"
                  >
                    Belum ada setoran untuk minggu ke-{{ mingguKeNumber }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <!-- Daftar Anggota Belum Setor -->
      <Card v-if="anggotaBelumSetor.length > 0" class="w-full">
        <CardHeader>
          <CardTitle class="text-lg sm:text-xl">
            Anggota Belum Setor Minggu Ke-{{ mingguKeNumber }}
          </CardTitle>
          <CardDescription class="text-sm">
            Anggota yang belum melakukan setoran untuk minggu ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="person in anggotaBelumSetor"
              :key="person.id"
              class="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm break-words"
            >
              {{ person.nama }}
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
