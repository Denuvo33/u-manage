<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Wallet,
  Banknote,
  UserCheck,
  Calendar,
  Receipt,
} from "lucide-vue-next";

interface Props {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoSisa: number;
  jumlahMinggu: number;
  jumlahAnggota: number;
  jumlahTransaksi: number;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    <Card
      class="relative overflow-hidden bg-gradient-to-br from-emerald-400 via-green-500 to-green-600 text-white shadow-xl hover:scale-[1.02] transition-all duration-300 border-0"
    >
      <div class="absolute inset-0 bg-black opacity-5"></div>
      <div
        class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full"
      ></div>
      <CardHeader
        class="flex flex-row items-center justify-between pb-2 relative z-10"
      >
        <CardTitle class="text-sm font-medium">Total Pemasukan</CardTitle>
        <div class="bg-white bg-opacity-20 p-2 rounded-full">
          <TrendingUp class="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent class="relative z-10">
        <div class="text-xl lg:text-3xl font-extrabold">
          Rp {{ totalPemasukan.toLocaleString("id-ID") }}
        </div>
        <p class="text-xs opacity-80 flex items-center gap-1 mt-1">
          <Calendar class="w-3 h-3" />
          Dari {{ jumlahMinggu }} minggu
        </p>
      </CardContent>
    </Card>

    <Card
      class="relative overflow-hidden bg-gradient-to-br from-red-400 via-rose-500 to-red-600 text-white shadow-xl hover:scale-[1.02] transition-all duration-300 border-0"
    >
      <div class="absolute inset-0 bg-black opacity-5"></div>
      <div
        class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full"
      ></div>
      <CardHeader
        class="flex flex-row items-center justify-between pb-2 relative z-10"
      >
        <CardTitle class="text-sm font-medium">Total Pengeluaran</CardTitle>
        <div class="bg-white bg-opacity-20 p-2 rounded-full">
          <Wallet class="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent class="relative z-10">
        <div class="text-xl lg:text-3xl font-extrabold">
          Rp {{ totalPengeluaran.toLocaleString("id-ID") }}
        </div>
        <p class="text-xs opacity-80 flex items-center gap-1 mt-1">
          <Receipt class="w-3 h-3" />
          {{ jumlahTransaksi }} transaksi
        </p>
      </CardContent>
    </Card>

    <Card
      class="relative overflow-hidden bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 text-white shadow-xl hover:scale-[1.02] transition-all duration-300 border-0"
    >
      <div class="absolute inset-0 bg-black opacity-5"></div>
      <div
        class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full"
      ></div>
      <CardHeader
        class="flex flex-row items-center justify-between pb-2 relative z-10"
      >
        <CardTitle class="text-sm font-medium">Saldo Sisa</CardTitle>
        <div class="bg-white bg-opacity-20 p-2 rounded-full">
          <Banknote class="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent class="relative z-10">
        <div class="text-xl lg:text-3xl font-extrabold">
          Rp {{ saldoSisa.toLocaleString("id-ID") }}
        </div>
        <p class="text-xs opacity-80">Tersedia untuk digunakan</p>
      </CardContent>
    </Card>

    <Card
      class="relative overflow-hidden bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 text-white shadow-xl hover:scale-[1.02] transition-all duration-300 border-0"
    >
      <div class="absolute inset-0 bg-black opacity-5"></div>
      <div
        class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full"
      ></div>
      <CardHeader
        class="flex flex-row items-center justify-between pb-2 relative z-10"
      >
        <CardTitle class="text-sm font-medium">Jumlah Anggota</CardTitle>
        <div class="bg-white bg-opacity-20 p-2 rounded-full">
          <Users class="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent class="relative z-10">
        <div class="text-xl lg:text-3xl font-extrabold">
          {{ jumlahAnggota }}
        </div>
        <p class="text-xs opacity-80 flex items-center gap-1 mt-1">
          <UserCheck class="w-3 h-3" />
          Aktif
        </p>
      </CardContent>
    </Card>
  </div>
</template>
