<!-- components/AppSidebar.vue -->
<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, UserRound, Wallet, FileText } from "lucide-vue-next";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Anggota", url: "/anggota", icon: UserRound },
  { title: "Setoran", url: "/setoran", icon: Wallet },
  { title: "Pengeluaran", url: "/pengeluaran", icon: FileText },
];
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Bendahara App</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild>
                <RouterLink
                  :to="item.url"
                  :class="{
                    'bg-accent': route.path === item.url,
                  }"
                  class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:bg-accent"
                >
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
