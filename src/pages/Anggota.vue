<!-- pages/AnggotaPage.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { Plus, Edit, Trash2 } from "lucide-vue-next";
import type { Anggota, Setoran } from "@/types";

// State
const anggota = ref<Anggota[]>([]);
const setoran = ref<Setoran[]>([]);
const searchQuery = ref("");
const showForm = ref(false);
const formMode = ref<"add" | "edit">("add");
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
</script>
<template>
  <div class="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
    <!-- Header -->
    <div class="flex flex-wrap space-y-5 space-x-4 sm:space-y-1">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight gap-2">
          <UserRound class="w-7 h-7 text-blue-600" />
          Manajemen Anggota
        </h1>
        <p class="text-muted-foreground">Kelola data anggota dengan mudah</p>
      </div>
      <Button class="shadow-md" @click="openAddForm">
        <Plus class="h-4 w-4 mr-2" />
        Tambah Anggota
      </Button>
    </div>

    <!-- Search -->
    <div class="relative">
      <Input
        type="search"
        placeholder="Cari anggota..."
        class="w-full"
        v-model="searchQuery"
      />
    </div>

    <!-- Form Modal -->
    <Card v-if="showForm" class="w-full max-w-full md:max-w-md mx-auto">
      <CardHeader>
        <CardTitle
          >{{ formMode === "add" ? "Tambah" : "Edit" }} Anggota</CardTitle
        >
        <CardDescription>
          {{ formMode === "add" ? "Tambahkan" : "Perbarui" }} data anggota
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Input
          v-model="editedAnggota.nama"
          placeholder="Nama Anggota"
          class="w-full"
          required
        />
        <div class="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" class="w-full sm:w-auto" @click="cancelForm"
            >Batal</Button
          >
          <Button class="w-full sm:w-auto" @click="saveAnggota">Simpan</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Members Table -->
    <Card v-if="!showForm" class="max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Daftar Anggota</CardTitle>
        <CardDescription
          >Total {{ anggota.length }} anggota terdaftar</CardDescription
        >
      </CardHeader>
      <CardContent>
        <div class="block sm:hidden w-full">
          <div
            v-for="person in filteredAnggota"
            class="p-4 y-2"
            :key="person.id"
          >
            <hr />
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">{{ person.nama }}</span>
              <span class="text-sm font-semibold text-gray-600">
                Rp {{ person.totalSetoran.toLocaleString("id-ID") }}
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger><Trash2></Trash2></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anggota ini akan dihapus secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="deleteAnggota(person.id)"
                    >Continue</AlertDialogAction
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <!-- Desktop view -->
        <div class="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Total Setoran</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead class="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="person in filteredAnggota" :key="person.id">
                <TableCell class="font-medium">{{ person.nama }}</TableCell>
                <TableCell>
                  Rp {{ person.totalSetoran.toLocaleString("id-ID") }}
                </TableCell>
                <TableCell>
                  {{ new Date(person.createdAt).toLocaleDateString("id-ID") }}
                </TableCell>
                <TableCell class="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="openEditForm(person)"
                  >
                    <Edit />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      ><Trash2 class="w-6 h-6"
                    /></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Anggota ini akan dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction @click="deleteAnggota(person.id)"
                          >Continue</AlertDialogAction
                        >
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
              <TableRow v-if="filteredAnggota.length === 0">
                <TableCell
                  colspan="4"
                  class="text-center py-4 text-muted-foreground"
                >
                  {{
                    searchQuery
                      ? "Tidak ada anggota yang sesuai dengan pencarian"
                      : "Belum ada anggota. Tambahkan anggota baru."
                  }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
