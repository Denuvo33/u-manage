<script setup lang="ts">
import { computed } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  DollarSign,
  User,
  Activity,
  CalendarDays,
  Users,
  Receipt,
} from "lucide-vue-next";
import type { Anggota, Pengeluaran } from "@/types";

interface Props {
  anggota: Anggota[];
  pengeluaranTerbaru: Pengeluaran[];
  maksSetoranMingguan: number;
  maksSetoranOrang: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateMaksSetoranMingguan: [value: number];
  updateMaksSetoranOrang: [value: number];
}>();

const localMaksSetoranMingguan = computed({
  get: () => props.maksSetoranMingguan,
  set: (value) => emit("updateMaksSetoranMingguan", Number(value) || 0),
});

const localMaksSetoranOrang = computed({
  get: () => props.maksSetoranOrang,
  set: (value) => emit("updateMaksSetoranOrang", Number(value) || 0),
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-6">
    <!-- Member Progress -->
    <Card
      class="lg:col-span-4 max-h-100 overflow-auto p-4 lg:p-6 bg-white shadow-sm border"
    >
      <CardHeader class="pb-4">
        <CardTitle class="text-lg font-semibold flex items-center gap-2">
          <Target class="w-5 h-5 text-orange-500" />
          Status Setoran Minggu Ini
        </CardTitle>
        <CardDescription class="space-y-3">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium flex items-center gap-2">
                <DollarSign class="w-4 h-4 text-green-500" />
                Setoran Maksimal Mingguan
              </label>
              <Input
                type="number"
                class="mt-1"
                v-model.number="localMaksSetoranMingguan"
              />
            </div>
            <div>
              <label class="text-sm font-medium flex items-center gap-2">
                <User class="w-4 h-4 text-blue-500" />
                Setoran Maksimal per Anggota
              </label>
              <Input
                type="number"
                class="mt-1"
                v-model.number="localMaksSetoranOrang"
              />
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div
          v-for="person in anggota"
          :key="person.id"
          class="p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
              ></div>
              <span class="text-sm font-medium">{{ person.nama }}</span>
            </div>
            <div class="text-right">
              <span class="text-sm font-semibold text-gray-700">
                Rp {{ person.totalSetoran.toLocaleString("id-ID") }}
              </span>
              <p class="text-xs text-gray-500">
                {{
                  Math.round(
                    (person.totalSetoran / (maksSetoranOrang || 1500000)) * 100
                  )
                }}%
              </p>
            </div>
          </div>

          <Progress
            :model-value="
              (person.totalSetoran / (maksSetoranOrang || 1500000)) * 100
            "
            class="h-3 rounded-full overflow-hidden"
            :class="{
              'bg-red-100 [&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-500':
                (person.totalSetoran / (maksSetoranOrang || 1500000)) * 100 <
                40,
              'bg-yellow-100 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-yellow-500':
                (person.totalSetoran / (maksSetoranOrang || 1500000)) * 100 >=
                  40 &&
                (person.totalSetoran / (maksSetoranOrang || 1500000)) * 100 <
                  80,
              'bg-green-100 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500':
                (person.totalSetoran / (maksSetoranOrang || 1500000)) * 100 >=
                80,
            }"
          />
        </div>
        <div
          v-if="anggota.length === 0"
          class="text-center text-gray-400 py-8 flex flex-col items-center"
        >
          <Users class="w-12 h-12 mb-2 opacity-50" />
          <span>Belum ada data anggota</span>
        </div>
      </CardContent>
    </Card>

    <!-- Recent Expenses -->
    <Card class="lg:col-span-3 p-4 lg:p-6 h-fit bg-white shadow-sm border">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg font-semibold flex items-center gap-2">
          <Activity class="w-5 h-5 text-red-500" />
          Pengeluaran Terbaru
        </CardTitle>
        <CardDescription>5 transaksi terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="(item, index) in pengeluaranTerbaru.slice(0, 5)"
            :key="item.id"
            class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                {{ index + 1 }}
              </div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ item.deskripsi }}
              </p>
              <p class="text-xs text-gray-500 flex items-center gap-1">
                <CalendarDays class="w-3 h-3" />
                {{ new Date(item.tanggal).toLocaleDateString("id-ID") }}
              </p>
            </div>
            <div
              class="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded"
            >
              -Rp {{ item.nominal.toLocaleString("id-ID") }}
            </div>
          </div>
          <div
            v-if="pengeluaranTerbaru.length === 0"
            class="text-center text-gray-400 py-8 flex flex-col items-center"
          >
            <Receipt class="w-12 h-12 mb-2 opacity-50" />
            <span>Belum ada pengeluaran</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
