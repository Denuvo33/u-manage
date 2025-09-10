<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  FileDown,
  FileUp,
  FileJson,
  FileSpreadsheet,
} from "lucide-vue-next";

const emit = defineEmits<{
  exportData: [];
  importData: [];
  exportCsv: [];
  importCsv: [];
}>();
</script>

<template>
  <Card class="p-4 lg:p-6 bg-white shadow-sm border">
    <h2 class="font-semibold text-lg mb-4 flex items-center gap-2">
      <Database class="w-5 h-5 text-blue-500" />
      Import & Export Data
    </h2>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Button @click="emit('importData')" class="gap-2 text-sm">
        <FileJson class="w-4 h-4" /> Import JSON
      </Button>
      <Button @click="emit('exportData')" class="gap-2 text-sm">
        <FileJson class="w-4 h-4" /> Export JSON
      </Button>
      <Button @click="emit('importCsv')" class="gap-2 text-sm">
        <FileDown class="w-4 h-4" /> Import CSV
      </Button>
      <Button @click="emit('exportCsv')" class="gap-2 text-sm">
        <FileUp class="w-4 h-4" /> Export CSV
      </Button>
    </div>

    <div class="mt-4 space-y-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
      <p class="flex items-start gap-2">
        <FileJson class="w-4 h-4 mt-0.5 text-blue-500" />
        <span>
          <span class="font-medium">JSON</span> → menyimpan semua data dalam
          satu file yang mudah dibuka langsung di browser.
        </span>
      </p>
      <p class="flex items-start gap-2">
        <FileSpreadsheet class="w-4 h-4 mt-0.5 text-green-500" />
        <span>
          <span class="font-medium">CSV</span> → diexport terpisah menjadi
          beberapa file. Untuk import ulang, semua file harus dimasukkan.
        </span>
      </p>
    </div>
  </Card>
</template>
