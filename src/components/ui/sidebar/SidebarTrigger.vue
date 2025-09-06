<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Menu } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    class="p-2 bg-transparent border text-black relative hover:bg-transparent"
    :class="cn('h-12 w-fit', props.class)"
    @click="toggleSidebar"
  >
    <Menu class="w-fit h-fit" />
    Sidebar

    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
