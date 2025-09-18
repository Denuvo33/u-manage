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
import {
  LayoutDashboard,
  UserRound,
  Wallet,
  FileText,
  Instagram,
  Github,
} from "lucide-vue-next";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Anggota", url: "/anggota", icon: UserRound },
  { title: "Setoran", url: "/setoran", icon: Wallet },
  { title: "Pengeluaran", url: "/pengeluaran", icon: FileText },
];

const navigateUrl = (url: string) => {
  window.open(url, "_blank");
};
</script>

<template>
  <Sidebar class="overflow-hidden">
    <!-- Subtle background with elegant texture -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100"
    >
      <!-- Minimal geometric pattern -->
      <div class="absolute inset-0 opacity-30">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(71,85,105,0.15)_1px,transparent_0)] bg-[size:24px_24px]"
        ></div>
      </div>

      <!-- Subtle gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-slate-200/30"
      ></div>
    </div>

    <SidebarContent class="relative z-10">
      <SidebarGroup>
        <!-- Premium Logo Area -->
        <div class="flex items-center justify-center py-8 mb-6">
          <div class="relative">
            <SidebarGroupLabel
              class="font-bold text-slate-800 text-2xl tracking-tight font-heading"
            >
              U-Kelola
            </SidebarGroupLabel>
            <div
              class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"
            ></div>
            <div
              class="text-xs text-slate-500 text-center mt-3 font-medium tracking-widest uppercase"
            >
              Management Suite
            </div>
          </div>
        </div>

        <SidebarGroupContent class="space-y-1 px-3">
          <!-- Section Label -->
          <div class="flex items-center gap-3 px-3 py-3 mb-4">
            <div class="w-1 h-4 bg-slate-300 rounded-full"></div>
            <span
              class="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans"
            >
              Site Management
            </span>
            <div
              class="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"
            ></div>
          </div>

          <SidebarMenu class="space-y-2">
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton class="group relative w-full" asChild>
                <RouterLink
                  :to="item.url"
                  :class="{
                    'bg-white shadow-sm border border-slate-200/60 text-slate-800':
                      route.path === item.url,
                    'hover:bg-white/60 hover:shadow-sm text-slate-600 hover:text-slate-800':
                      route.path !== item.url,
                  }"
                  class="flex items-center gap-4 px-4 py-3.5 mx-1 transition-all duration-200 rounded-lg backdrop-blur-sm border border-transparent group-hover:border-slate-200/40"
                >
                  <!-- Active indicator -->
                  <div
                    v-if="route.path === item.url"
                    class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-slate-600 rounded-r-full"
                  ></div>

                  <!-- Icon -->
                  <div
                    :class="{
                      'text-slate-700': route.path === item.url,
                      'text-slate-500 group-hover:text-slate-700':
                        route.path !== item.url,
                    }"
                    class="transition-colors duration-200 flex-shrink-0"
                  >
                    <component :is="item.icon" class="h-5 w-5" />
                  </div>

                  <!-- Text -->
                  <span
                    :class="{
                      'font-medium text-slate-800': route.path === item.url,
                      'font-normal group-hover:font-medium':
                        route.path !== item.url,
                    }"
                    class="font-open-sans transition-all duration-200 flex-1"
                  >
                    {{ item.title }}
                  </span>

                  <!-- Subtle arrow for active -->
                  <div
                    v-if="route.path === item.url"
                    class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-60"
                  ></div>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Elegant Footer -->
    <div
      class="relative z-10 border-t border-slate-200/50 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm"
    >
      <div class="p-5">
        <!-- Copyright -->
        <div class="text-center mb-4">
          <div class="text-xs text-slate-500 mb-1">© 2025</div>
          <div class="font-medium text-slate-700 text-sm tracking-wide">
            Syahid Al Baddry
          </div>
        </div>

        <!-- Social Links -->
        <div class="flex justify-center gap-3">
          <button
            @click="navigateUrl('https://www.instagram.com/syahid_cdr/')"
            class="group relative p-2.5 rounded-lg bg-white/70 hover:bg-white hover:shadow-sm transition-all duration-200 border border-slate-200/60 hover:border-slate-300"
          >
            <Instagram
              class="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors duration-200"
            />
          </button>

          <button
            @click="navigateUrl('https://github.com/Denuvo33')"
            class="group relative p-2.5 rounded-lg bg-white/70 hover:bg-white hover:shadow-sm transition-all duration-200 border border-slate-200/60 hover:border-slate-300"
          >
            <Github
              class="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors duration-200"
            />
          </button>
        </div>

        <!-- Decorative element -->
        <div class="flex justify-center mt-4">
          <div
            class="w-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
          ></div>
        </div>
      </div>
    </div>
  </Sidebar>
</template>

<style scoped>
/* Subtle animations and transitions */
.sidebar-menu-button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom backdrop blur enhancement */
.backdrop-blur-sm {
  backdrop-filter: blur(4px) saturate(1.1);
  -webkit-backdrop-filter: blur(4px) saturate(1.1);
}

/* Refined shadow */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
}
</style>
