<script setup lang="ts">
import { computed } from "vue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Pengeluaran } from "@/types";

interface Props {
  totalPengeluaran: number;
  totalPengeluaranSemua: number;
  filteredPengeluaran: Pengeluaran[];
  pengeluaran: Pengeluaran[];
  hasActiveFilter: boolean;
  filters: any;
  getJenisById: (id: string) => { nama: string; warna: string } | undefined;
}

const props = defineProps<Props>();

const totalPerJenis = computed(() => {
  const totals: { [key: string]: number } = {};
  props.filteredPengeluaran.forEach((p) => {
    totals[p.jenisId] = (totals[p.jenisId] || 0) + p.nominal;
  });
  return totals;
});

const averagePerTransaction = computed(() => {
  return props.filteredPengeluaran.length > 0
    ? props.totalPengeluaran / props.filteredPengeluaran.length
    : 0;
});
</script>

<template>
  <div class="space-y-4">
    <!-- Main Statistics -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card
        class="bg-gradient-to-r shadow-lg from-red-400 hover:scale-[1.02] transition-transform duration-200 text-white to-red-600"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">
            {{
              hasActiveFilter
                ? "Total Pengeluaran (Filtered)"
                : "Total Pengeluaran"
            }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp {{ totalPengeluaran.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{
              hasActiveFilter
                ? `Dari ${filteredPengeluaran.length} transaksi`
                : "Seluruh periode"
            }}
          </p>
          <p
            v-if="hasActiveFilter && totalPengeluaranSemua !== totalPengeluaran"
            class="text-xs text-white/80 mt-1"
          >
            Total keseluruhan: Rp
            {{ totalPengeluaranSemua.toLocaleString("id-ID") }}
          </p>
        </CardContent>
      </Card>

      <Card
        class="bg-gradient-to-r shadow-lg from-green-400 hover:scale-[1.02] transition-transform duration-200 text-white to-green-600"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Jumlah Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ filteredPengeluaran.length }}</div>
          <p class="text-xs text-muted-foreground">
            {{ hasActiveFilter ? "Hasil filter" : "Catatan pengeluaran" }}
          </p>
          <p
            v-if="
              hasActiveFilter &&
              pengeluaran.length !== filteredPengeluaran.length
            "
            class="text-xs text-white/80 mt-1"
          >
            Total keseluruhan: {{ pengeluaran.length }}
          </p>
        </CardContent>
      </Card>

      <Card
        class="bg-gradient-to-r shadow-lg from-blue-400 hover:scale-[1.02] transition-transform duration-200 text-white to-blue-600"
      >
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Rata-rata</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            Rp {{ averagePerTransaction.toLocaleString("id-ID") }}
          </div>
          <p class="text-xs text-muted-foreground">Per transaksi</p>
        </CardContent>
      </Card>
    </div>

    <!-- Summary by Type -->
    <Card
      v-if="Object.keys(totalPerJenis).length > 1 || hasActiveFilter"
      class="border-dashed"
    >
      <CardHeader>
        <CardTitle class="text-lg">Ringkasan Per Jenis</CardTitle>
        <CardDescription>
          {{
            hasActiveFilter
              ? "Berdasarkan filter yang aktif"
              : "Seluruh data pengeluaran"
          }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(total, jenisId) in totalPerJenis"
            :key="jenisId"
            class="flex items-center justify-between p-3 rounded-lg border"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{
                  backgroundColor: getJenisById(String(jenisId))?.warna,
                }"
              />
              <span class="font-medium">{{
                getJenisById(String(jenisId))?.nama
              }}</span>
            </div>
            <span class="font-bold text-destructive">
              Rp {{ total.toLocaleString("id-ID") }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
