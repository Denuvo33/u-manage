<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-vue-next";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Props {
  filters: {
    jenisId: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    search: string;
  };
  activeFilterCount: number;
  getJenisById: (id: string) => { nama: string; warna: string } | undefined;
}

defineProps<Props>();

defineEmits<{
  clearFilter: [type: string];
  clearAllFilters: [];
}>();
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center">
    <span class="text-sm text-muted-foreground">Filter aktif:</span>

    <Badge v-if="filters.jenisId" variant="secondary" class="gap-1">
      <div
        class="w-2 h-2 rounded-full"
        :style="{ backgroundColor: getJenisById(filters.jenisId)?.warna }"
      />
      {{ getJenisById(filters.jenisId)?.nama }}
      <X
        class="h-3 w-3 cursor-pointer"
        @click="$emit('clearFilter', 'jenis')"
      />
    </Badge>

    <Badge v-if="filters.tanggalMulai" variant="secondary" class="gap-1">
      Dari:
      {{
        format(new Date(filters.tanggalMulai), "dd MMM yyyy", { locale: id })
      }}
      <X
        class="h-3 w-3 cursor-pointer"
        @click="$emit('clearFilter', 'tanggalMulai')"
      />
    </Badge>

    <Badge v-if="filters.tanggalSelesai" variant="secondary" class="gap-1">
      Sampai:
      {{
        format(new Date(filters.tanggalSelesai), "dd MMM yyyy", { locale: id })
      }}
      <X
        class="h-3 w-3 cursor-pointer"
        @click="$emit('clearFilter', 'tanggalSelesai')"
      />
    </Badge>

    <Badge v-if="filters.search" variant="secondary" class="gap-1">
      "{{ filters.search }}"
      <X
        class="h-3 w-3 cursor-pointer"
        @click="$emit('clearFilter', 'search')"
      />
    </Badge>

    <Button
      variant="ghost"
      size="sm"
      @click="$emit('clearAllFilters')"
      class="h-6 px-2 text-xs"
    >
      Hapus Semua
    </Button>
  </div>
</template>
