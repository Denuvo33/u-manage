<script setup lang="ts">
import { MessageCircleWarning } from "lucide-vue-next";
</script>

<template>
  <div
    class="p-3 lg:p-4 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-50 to-orange-100 border border-yellow-300 text-yellow-800 flex items-start gap-3 shadow-sm"
  >
    <div class="bg-yellow-500 p-1 rounded-full">
      <MessageCircleWarning class="w-4 h-4 text-white" />
    </div>
    <p class="text-sm leading-relaxed">
      Pastikan selalu <b>membackup data</b> karena semua informasi hanya
      tersimpan secara lokal di browser.
    </p>
  </div>
</template>
