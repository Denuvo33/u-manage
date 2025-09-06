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
import { Plus, Edit, Trash2, Search } from "lucide-vue-next";
import type { Anggota } from "@/types";

// State
const anggota = ref<Anggota[]>([]);
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
  if (savedAnggota) anggota.value = JSON.parse(savedAnggota);
});

// Save data to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("anggota", JSON.stringify(anggota.value));
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
  if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
    anggota.value = anggota.value.filter((a) => a.id !== id);
    saveToLocalStorage();
  }
};

const cancelForm = () => {
  showForm.value = false;
};
</script>
<template>
  <div class="p-4 md:p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">
          Manajemen Anggota
        </h1>
        <p class="text-sm md:text-base text-muted-foreground">
          Kelola data anggota KKN
        </p>
      </div>
      <Button class="w-fit" @click="openAddForm">
        <Plus class="h-4 w-4 mr-2" />
        Tambah Anggota
      </Button>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Cari anggota..."
        class="pl-8"
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
          {{ formMode === "add" ? "Tambahkan" : "Perbarui" }} data anggota KKN
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Input
          v-model="editedAnggota.nama"
          placeholder="Nama Anggota"
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
    <Card v-if="!showForm">
      <CardHeader>
        <CardTitle>Daftar Anggota</CardTitle>
        <CardDescription
          >Total {{ anggota.length }} anggota terdaftar</CardDescription
        >
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <Table class="min-w-[600px]">
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
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="deleteAnggota(person.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
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
