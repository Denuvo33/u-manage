<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
</script>

<template>
  <section>
    <SidebarProvider
      class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <router-view />
      </main>
    </SidebarProvider>
  </section>
</template>
