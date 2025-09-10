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
        <SidebarGroupLabel
          class="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-wide drop-shadow-md"
        >
          U-Kelola
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton class="text-xl" asChild>
                <RouterLink
                  :to="item.url"
                  :class="{
                    'bg-gradient-to-r text-xl from-blue-500 via-purple-500 to-pink-500':
                      route.path === item.url,
                  }"
                  class="flex items-center gap-3 px-3 py-2 transition-all rounded-lg"
                >
                  <component :is="item.icon" class="h-4 w-4" />
                  <span class="font-open-sans">{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <!-- Footer -->
    <div class="p-4 border-t text-center text-sm">
      © 2025 <span class="font-semibold">Syahid Al Baddry</span>
    </div>
  </Sidebar>
</template>
