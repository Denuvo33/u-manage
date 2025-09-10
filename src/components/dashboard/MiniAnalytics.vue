<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { Calculator, TrendingUp, Clock } from "lucide-vue-next";

interface Props {
  totalPemasukan: number;
  totalPengeluaran: number;
  jumlahAnggota: number;
  jumlahMinggu: number;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
    <Card
      class="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-blue-600">Rata-rata Setoran</p>
          <p class="text-2xl font-bold text-blue-700">
            Rp
            {{
              Math.round(totalPemasukan / (jumlahAnggota || 1)).toLocaleString(
                "id-ID"
              )
            }}
          </p>
        </div>
        <div class="bg-blue-500 p-3 rounded-full">
          <Calculator class="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>

    <Card
      class="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-green-600">Efisiensi</p>
          <p class="text-2xl font-bold text-green-700">
            {{
              totalPemasukan > 0
                ? Math.round(
                    ((totalPemasukan - totalPengeluaran) / totalPemasukan) * 100
                  )
                : 0
            }}%
          </p>
        </div>
        <div class="bg-green-500 p-3 rounded-full">
          <TrendingUp class="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>

    <Card
      class="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-purple-600">Periode Aktif</p>
          <p class="text-2xl font-bold text-purple-700">
            {{ jumlahMinggu }} Minggu
          </p>
        </div>
        <div class="bg-purple-500 p-3 rounded-full">
          <Clock class="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  </div>
</template>
