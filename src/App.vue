<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
</script>

<template>
  <head title="aaa"></head>
  <section>
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <router-view />
      </main>
    </SidebarProvider>
  </section>
</template>
