<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-vue-next";

interface Props {
  filters: {
    jenisId: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    search: string;
  };
  activeFilterCount: number;
  getJenisById: (id: string) => { nama: string; warna: string } | undefined;
  sortedJenis: { id: string; nama: string; warna: string }[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:filters": [filters: any];
  clearAllFilters: [];
}>();

const updateFilters = (key: string, value: string) => {
  emit("update:filters", {
    ...props.filters,
    [key]: value,
  });
};
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" class="relative">
        <Filter class="h-4 w-4 mr-2" />
        Filter
        <Badge
          v-if="activeFilterCount > 0"
          class="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
          variant="destructive"
        >
          {{ activeFilterCount }}
        </Badge>
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Filter Pengeluaran</DialogTitle>
        <DialogDescription>
          Filter data pengeluaran berdasarkan kriteria tertentu
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="filter-jenis">Jenis Pengeluaran</Label>
          <select
            id="filter-jenis"
            :value="filters.jenisId"
            @change="
              updateFilters(
                'jenisId',
                ($event.target as HTMLSelectElement).value
              )
            "
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Semua Jenis</option>
            <option
              v-for="jenis in sortedJenis"
              :key="jenis.id"
              :value="jenis.id"
            >
              {{ jenis.nama }}
            </option>
          </select>
          <!-- Show selected jenis with color -->
          <div
            v-if="filters.jenisId"
            class="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: getJenisById(filters.jenisId)?.warna }"
            />
            Dipilih: {{ getJenisById(filters.jenisId)?.nama }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="filter-start">Tanggal Mulai</Label>
            <Input
              id="filter-start"
              type="date"
              :value="filters.tanggalMulai"
              @input="
                updateFilters(
                  'tanggalMulai',
                  ($event.target as HTMLInputElement).value
                )
              "
            />
          </div>
          <div class="space-y-2">
            <Label for="filter-end">Tanggal Selesai</Label>
            <Input
              id="filter-end"
              type="date"
              :value="filters.tanggalSelesai"
              @input="
                updateFilters(
                  'tanggalSelesai',
                  ($event.target as HTMLInputElement).value
                )
              "
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="filter-search">Cari Deskripsi</Label>
          <Input
            id="filter-search"
            :value="filters.search"
            @input="
              updateFilters('search', ($event.target as HTMLInputElement).value)
            "
            placeholder="Cari berdasarkan deskripsi..."
          />
        </div>
      </div>
      <DialogFooter class="flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          class="w-full sm:w-auto"
          @click="$emit('clearAllFilters')"
        >
          Hapus Semua Filter
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
