<script setup lang="ts">
import { Clock } from "lucide-vue-next";

interface Props {
  currentDate: string;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
    <div
      class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0"
    >
      <div>
        <h1
          class="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Dashboard Keuangan
        </h1>
        <p class="text-muted-foreground">
          Ringkasan keuangan dan status setoran anggota
        </p>
      </div>
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <Clock class="w-4 h-4" />
        <span>{{ currentDate }}</span>
      </div>
    </div>
  </div>
</template>
