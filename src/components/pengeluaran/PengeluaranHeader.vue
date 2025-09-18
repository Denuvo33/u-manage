<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-vue-next";

interface Props {
  showJenisDialog: boolean;
}

defineProps<Props>();

defineEmits<{
  tambahPengeluaran: [];
  toggleJenisDialog: [];
}>();
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Pengeluaran</h1>
      <p class="text-muted-foreground">Kelola pengeluaran kas</p>
    </div>
    <div class="flex gap-2 flex-wrap">
      <Button variant="outline" @click="$emit('toggleJenisDialog')">
        <Settings class="h-4 w-4 mr-2" />
        Kelola Jenis
      </Button>

      <!-- Slot for filter dialog -->
      <slot name="filter-dialog" />

      <Button @click="$emit('tambahPengeluaran')">
        <Plus class="h-4 w-4 mr-2" />
        Tambah Pengeluaran
      </Button>
    </div>
  </div>
</template>
