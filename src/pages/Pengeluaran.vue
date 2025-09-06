<!-- pages/PengeluaranPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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
import { Trash2, Edit, Plus } from "lucide-vue-next";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Pengeluaran } from "@/types";

// Data state
const pengeluaran = ref<Pengeluaran[]>([]);
const showForm = ref(false);

// Form state
const tanggalPengeluaran = ref<string>(new Date().toISOString().split("T")[0]);
const deskripsiPengeluaran = ref<string>("");
const nominalPengeluaran = ref<number>(0);
const editId = ref<string | null>(null);

// Computed properties
const totalPengeluaran = computed(() => {
  return pengeluaran.value.reduce((sum, p) => sum + p.nominal, 0);
});

const pengeluaranTerbaru = computed(() => {
  return [...pengeluaran.value].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );
});

// Load data from localStorage
onMounted(() => {
  const savedPengeluaran = localStorage.getItem("pengeluaran");
  if (savedPengeluaran) pengeluaran.value = JSON.parse(savedPengeluaran);
});

// Save data to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("pengeluaran", JSON.stringify(pengeluaran.value));
};

// Handle form operations
const openTambahPengeluaran = () => {
  tanggalPengeluaran.value = new Date().toISOString().split("T")[0];
  deskripsiPengeluaran.value = "";
  nominalPengeluaran.value = 0;
  showForm.value = true;
};

const openEditPengeluaran = (item: Pengeluaran) => {
  tanggalPengeluaran.value = new Date(item.tanggal).toISOString().split("T")[0];
  deskripsiPengeluaran.value = item.deskripsi;
  nominalPengeluaran.value = item.nominal;
  editId.value = item.id; // simpan id yg mau di edit
  showForm.value = true;
};

const simpanPengeluaran = () => {
  if (!deskripsiPengeluaran.value.trim() || nominalPengeluaran.value <= 0)
    return;

  if (editId.value) {
    // mode edit
    const index = pengeluaran.value.findIndex((p) => p.id === editId.value);
    if (index !== -1) {
      pengeluaran.value[index] = {
        ...pengeluaran.value[index],
        tanggal: new Date(tanggalPengeluaran.value),
        deskripsi: deskripsiPengeluaran.value,
        nominal: nominalPengeluaran.value,
      };
    }
  } else {
    // mode tambah
    const pengeluaranBaru: Pengeluaran = {
      id: Date.now().toString(),
      tanggal: new Date(tanggalPengeluaran.value),
      deskripsi: deskripsiPengeluaran.value,
      nominal: nominalPengeluaran.value,
    };
    pengeluaran.value.push(pengeluaranBaru);
  }

  saveToLocalStorage();
  showForm.value = false;
};

const hapusPengeluaran = (id: string) => {
  pengeluaran.value = pengeluaran.value.filter((p) => p.id !== id);
  saveToLocalStorage();
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Pengeluaran</h1>
        <p class="text-muted-foreground">Kelola pengeluaran kas</p>
      </div>
      <Button @click="openTambahPengeluaran">
        <Plus class="h-4 w-4 mr-2" />
        Tambah Pengeluaran
      </Button>
    </div>

    <!-- Statistik -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Total Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-destructive">
            Rp {{ totalPengeluaran.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs text-muted-foreground">Seluruh periode</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Jumlah Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ pengeluaran.length }}</div>
          <p class="text-xs text-muted-foreground">Catatan pengeluaran</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Rata-rata</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp
            {{
              (pengeluaran.length > 0
                ? totalPengeluaran / pengeluaran.length
                : 0
              ).toLocaleString("id-ID")
            }}
          </div>
          <p class="text-xs text-muted-foreground">Per transaksi</p>
        </CardContent>
      </Card>
    </div>

    <!-- Form Tambah/Edit Pengeluaran -->
    <Card v-if="showForm">
      <CardHeader>
        <CardTitle>
          {{ editId ? "Edit Pengeluaran" : "Tambah Pengeluaran" }}
        </CardTitle>
        <CardDescription>
          {{ editId ? "Perbarui" : "Tambahkan" }} catatan pengeluaran kas
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="tanggal">Tanggal Pengeluaran</Label>
            <Input
              id="tanggal"
              type="date"
              v-model="tanggalPengeluaran"
              :max="new Date().toISOString().split('T')[0]"
            />
          </div>

          <div class="space-y-2">
            <Label for="nominal">Nominal</Label>
            <Input
              id="nominal"
              type="number"
              placeholder="Masukkan nominal pengeluaran"
              v-model="nominalPengeluaran"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="deskripsi">Deskripsi Pengeluaran</Label>
          <Input
            id="deskripsi"
            type="text"
            placeholder="Contoh: Beli bahan masak, transportasi, dll."
            v-model="deskripsiPengeluaran"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <Button variant="outline" @click="showForm = false">Batal</Button>
          <Button
            @click="simpanPengeluaran"
            :disabled="!deskripsiPengeluaran.trim() || nominalPengeluaran <= 0"
          >
            <Save class="h-4 w-4 mr-2" />
            {{ editId ? "Update" : "Simpan" }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Daftar Pengeluaran -->
    <Card>
      <CardHeader>
        <CardTitle>Histori Pengeluaran</CardTitle>
        <CardDescription> Daftar seluruh pengeluaran kas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead class="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in pengeluaranTerbaru" :key="item.id">
              <TableCell>{{
                format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })
              }}</TableCell>
              <TableCell class="font-medium">{{ item.deskripsi }}</TableCell>
              <TableCell class="text-destructive"
                >Rp {{ item.nominal.toLocaleString("id-ID") }}</TableCell
              >
              <TableCell class="text-right flex gap-2 justify-end">
                <!-- Tombol Edit -->
                <Button
                  variant="ghost"
                  size="icon"
                  @click="openEditPengeluaran(item)"
                >
                  <Edit class="h-5 w-5" />
                </Button>

                <!-- Tombol Hapus -->
                <AlertDialog>
                  <AlertDialogTrigger
                    ><Trash2 class="h-6 w-6"
                  /></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Pengeluaran ini akan dihapus secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction @click="hapusPengeluaran(item.id)"
                        >Continue</AlertDialogAction
                      >
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
            <TableRow v-if="pengeluaran.length === 0">
              <TableCell
                colspan="4"
                class="text-center py-4 text-muted-foreground"
              >
                Belum ada catatan pengeluaran
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
