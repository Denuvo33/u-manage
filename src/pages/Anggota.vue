<!-- pages/AnggotaPage.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plus,
  Edit,
  Trash2,
  UserRound,
  Wallet,
  Search,
  Users,
} from "lucide-vue-next";
import type { Anggota, Setoran } from "@/types";

// State
const anggota = ref<Anggota[]>([]);
const setoran = ref<Setoran[]>([]);
const searchQuery = ref("");
const showForm = ref(false);
const showDepositDialog = ref(false);
const formMode = ref<"add" | "edit">("add");
const selectedAnggotaForDeposit = ref<Anggota | null>(null);
const depositAmount = ref(0);

const editedAnggota = ref<Anggota>({
  id: "",
  nama: "",
  totalSetoran: 0,
  createdAt: new Date(),
});

// Filter anggota based on search query
const filteredAnggota = computed(() => {
  if (!searchQuery.value) return anggota.value;
  return anggota.value.filter((a) =>
    a.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Statistics
const totalAnggota = computed(() => anggota.value.length);
const totalSetoranKeseluruhan = computed(() =>
  anggota.value.reduce((sum, a) => sum + a.totalSetoran, 0)
);
const anggotaTertinggi = computed(() => {
  if (anggota.value.length === 0) return null;
  return anggota.value.reduce((max, a) =>
    a.totalSetoran > max.totalSetoran ? a : max
  );
});

// Load data from localStorage
onMounted(() => {
  const savedAnggota = localStorage.getItem("anggota");
  const savedSetoran = localStorage.getItem("setoran");
  if (savedAnggota) anggota.value = JSON.parse(savedAnggota);
  if (savedSetoran) setoran.value = JSON.parse(savedSetoran);
});

// Save data to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("anggota", JSON.stringify(anggota.value));
  localStorage.setItem("setoran", JSON.stringify(setoran.value));
};

// Handle form operations
const openAddForm = () => {
  formMode.value = "add";
  editedAnggota.value = {
    id: Date.now().toString(),
    nama: "",
    totalSetoran: 0,
    createdAt: new Date(),
  };
  showForm.value = true;
};

const openEditForm = (person: Anggota) => {
  formMode.value = "edit";
  editedAnggota.value = { ...person };
  showForm.value = true;
};

const saveAnggota = () => {
  if (!editedAnggota.value.nama.trim()) return;

  if (formMode.value === "add") {
    anggota.value.push({ ...editedAnggota.value });
  } else {
    const index = anggota.value.findIndex(
      (a) => a.id === editedAnggota.value.id
    );
    if (index !== -1) {
      anggota.value[index] = { ...editedAnggota.value };
    }
  }

  saveToLocalStorage();
  showForm.value = false;
};

const deleteAnggota = (id: string) => {
  anggota.value = anggota.value.filter((a) => a.id !== id);
  setoran.value = setoran.value.filter((s) => s.anggotaId !== id);
  saveToLocalStorage();
};

const cancelForm = () => {
  showForm.value = false;
};

// Deposit functionality
const openDepositDialog = (person: Anggota) => {
  selectedAnggotaForDeposit.value = person;
  depositAmount.value = 0;
  showDepositDialog.value = true;
};

const processDeposit = () => {
  if (!selectedAnggotaForDeposit.value || depositAmount.value <= 0) return;

  // Update anggota total setoran
  const anggotaIndex = anggota.value.findIndex(
    (a) => a.id === selectedAnggotaForDeposit.value!.id
  );
  if (anggotaIndex !== -1) {
    anggota.value[anggotaIndex].totalSetoran += depositAmount.value;
  }

  // Add deposit as setoran entry
  const newSetoran: Setoran = {
    id: Date.now().toString(),
    anggotaId: selectedAnggotaForDeposit.value.id,
    minggu: 0, // 0 indicates deposit (not weekly payment)
    nominal: depositAmount.value,
    tanggal: new Date(),
    jenis: "full", // or create new type 'deposit'
  };

  setoran.value.push(newSetoran);
  saveToLocalStorage();

  showDepositDialog.value = false;
  selectedAnggotaForDeposit.value = null;
  depositAmount.value = 0;
};

const cancelDeposit = () => {
  showDepositDialog.value = false;
  selectedAnggotaForDeposit.value = null;
  depositAmount.value = 0;
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
</script>

<template>
  <div class="min-h-screen p-4 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-600 rounded-lg shadow-lg">
              <UserRound class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">
              Manajemen Anggota
            </h1>
          </div>
          <p class="text-gray-600">
            Kelola data anggota dan deposit dengan mudah
          </p>
        </div>
        <Button
          class="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          @click="openAddForm"
        >
          <Plus class="h-4 w-4 mr-2" />
          Tambah Anggota
        </Button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          class="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Anggota</p>
                <p class="text-3xl font-bold text-blue-600">
                  {{ totalAnggota }}
                </p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <Users class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          class="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Setoran</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ formatCurrency(totalSetoranKeseluruhan) }}
                </p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <Wallet class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          class="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  Anggota Tertinggi
                </p>
                <p class="text-lg font-bold text-purple-600">
                  {{ anggotaTertinggi ? anggotaTertinggi.nama : "-" }}
                </p>
                <p class="text-sm text-gray-500">
                  {{
                    anggotaTertinggi
                      ? formatCurrency(anggotaTertinggi.totalSetoran)
                      : "-"
                  }}
                </p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full">
                <UserRound class="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Search -->
      <Card class="bg-white shadow-lg">
        <CardContent class="p-6">
          <div class="relative">
            <Search class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Cari nama anggota..."
              class="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              v-model="searchQuery"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Form Modal -->
      <Card
        v-if="showForm"
        class="bg-white shadow-xl border-0 max-w-md mx-auto"
      >
        <CardHeader
          class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg"
        >
          <CardTitle class="text-xl">
            {{ formMode === "add" ? "Tambah" : "Edit" }} Anggota
          </CardTitle>
          <CardDescription class="text-blue-100">
            {{
              formMode === "add"
                ? "Tambahkan anggota baru"
                : "Perbarui data anggota"
            }}
          </CardDescription>
        </CardHeader>
        <CardContent class="p-6 space-y-6">
          <div class="space-y-2">
            <Label for="nama" class="text-sm font-medium text-gray-700"
              >Nama Anggota</Label
            >
            <Input
              id="nama"
              v-model="editedAnggota.nama"
              placeholder="Masukkan nama anggota"
              class="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              class="flex-1 h-12 border-gray-300 hover:bg-gray-50"
              @click="cancelForm"
            >
              Batal
            </Button>
            <Button
              class="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
              @click="saveAnggota"
            >
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Members Table -->
      <Card v-if="!showForm" class="bg-white shadow-lg overflow-hidden">
        <CardHeader class="bg-gray-50 border-b">
          <CardTitle class="text-xl text-gray-900">Daftar Anggota</CardTitle>
          <CardDescription class="text-gray-600">
            {{ filteredAnggota.length }} dari {{ totalAnggota }} anggota
            ditampilkan
          </CardDescription>
        </CardHeader>
        <CardContent class="p-0">
          <!-- Mobile view -->
          <div class="block lg:hidden">
            <div v-if="filteredAnggota.length === 0" class="p-8 text-center">
              <UserRound class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 text-lg">
                {{
                  searchQuery
                    ? "Tidak ada anggota yang sesuai dengan pencarian"
                    : "Belum ada anggota terdaftar"
                }}
              </p>
            </div>
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="person in filteredAnggota"
                :key="person.id"
                class="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                    >
                      <UserRound class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">
                        {{ person.nama }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {{
                          new Date(person.createdAt).toLocaleDateString("id-ID")
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-green-600">
                      {{ formatCurrency(person.totalSetoran) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    class="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    @click="openDepositDialog(person)"
                  >
                    <Wallet class="w-4 h-4 mr-1" />
                    Deposit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    class="border-gray-200 hover:bg-gray-50"
                    @click="openEditForm(person)"
                  >
                    <Edit class="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        class="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 class="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Anggota</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus
                          <strong>{{ person.nama }}</strong
                          >? Semua data setoran akan ikut terhapus dan tidak
                          dapat dikembalikan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          class="bg-red-600 hover:bg-red-700"
                          @click="deleteAnggota(person.id)"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop view -->
          <div class="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow class="bg-gray-50">
                  <TableHead class="font-semibold text-gray-900"
                    >Nama</TableHead
                  >
                  <TableHead class="font-semibold text-gray-900"
                    >Total Setoran</TableHead
                  >
                  <TableHead class="font-semibold text-gray-900"
                    >Tanggal Bergabung</TableHead
                  >
                  <TableHead class="text-right font-semibold text-gray-900"
                    >Aksi</TableHead
                  >
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="person in filteredAnggota"
                  :key="person.id"
                  class="hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell>
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                      >
                        <UserRound class="w-4 h-4 text-blue-600" />
                      </div>
                      <span class="font-medium text-gray-900">{{
                        person.nama
                      }}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span class="font-semibold text-green-600">{{
                      formatCurrency(person.totalSetoran)
                    }}</span>
                  </TableCell>
                  <TableCell class="text-gray-600">
                    {{ new Date(person.createdAt).toLocaleDateString("id-ID") }}
                  </TableCell>
                  <TableCell class="text-right">
                    <div class="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        class="border-blue-200 text-blue-600 hover:bg-blue-50"
                        @click="openDepositDialog(person)"
                      >
                        <Wallet class="w-4 h-4 mr-1" />
                        Deposit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        class="hover:bg-gray-100"
                        @click="openEditForm(person)"
                      >
                        <Edit class="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            class="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 class="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Anggota</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus
                              <strong>{{ person.nama }}</strong
                              >? Semua data setoran akan ikut terhapus dan tidak
                              dapat dikembalikan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              class="bg-red-600 hover:bg-red-700"
                              @click="deleteAnggota(person.id)"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow v-if="filteredAnggota.length === 0">
                  <TableCell colspan="4" class="text-center py-12">
                    <UserRound class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p class="text-gray-500 text-lg">
                      {{
                        searchQuery
                          ? "Tidak ada anggota yang sesuai dengan pencarian"
                          : "Belum ada anggota terdaftar"
                      }}
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <!-- Deposit Dialog -->
      <Dialog v-model:open="showDepositDialog">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-2">
              <Wallet class="w-5 h-5 text-blue-600" />
              Deposit Anggota
            </DialogTitle>
            <DialogDescription>
              Tambahkan deposit untuk
              <strong>{{ selectedAnggotaForDeposit?.nama }}</strong>
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label for="deposit" class="text-sm font-medium text-gray-700"
                >Jumlah Deposit</Label
              >
              <Input
                id="deposit"
                type="number"
                v-model.number="depositAmount"
                placeholder="Masukkan jumlah deposit"
                class="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div v-if="depositAmount > 0" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <strong>Preview:</strong> {{ formatCurrency(depositAmount) }}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="cancelDeposit"> Batal </Button>
            <Button
              class="bg-blue-600 hover:bg-blue-700 text-white"
              @click="processDeposit"
              :disabled="depositAmount <= 0"
            >
              Proses Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
