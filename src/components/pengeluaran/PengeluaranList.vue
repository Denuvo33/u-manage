<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit } from "lucide-vue-next";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Pengeluaran } from "@/types";

interface Props {
  pengeluaran: Pengeluaran[];
  totalCount: number;
  hasActiveFilter: boolean;
  getJenisById: (id: string) => any;
}

defineProps<Props>();

defineEmits<{
  edit: [item: Pengeluaran];
  delete: [id: string];
}>();
</script>

<template>
  <Card class="max-h-120 overflow-y-auto">
    <CardHeader>
      <CardTitle>
        Histori Pengeluaran
        <span
          v-if="hasActiveFilter"
          class="text-sm font-normal text-muted-foreground"
        >
          ({{ pengeluaran.length }} dari {{ totalCount }} data)
        </span>
      </CardTitle>
      <CardDescription>
        {{
          hasActiveFilter
            ? "Daftar pengeluaran berdasarkan filter"
            : "Daftar seluruh pengeluaran kas"
        }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Mobile View -->
      <div class="block sm:hidden">
        <div
          v-for="item in pengeluaran"
          :key="item.id"
          class="border-b pb-4 mb-4 last:border-b-0"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{
                    backgroundColor: getJenisById(item.jenisId)?.warna,
                  }"
                />
                <Badge variant="outline" class="text-xs">
                  {{ getJenisById(item.jenisId)?.nama }}
                </Badge>
              </div>
              <p class="font-medium">{{ item.deskripsi }}</p>
              <p class="text-sm text-muted-foreground">
                {{
                  format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })
                }}
              </p>
              <div v-if="item.bukti" class="mt-2">
                <img :src="item.bukti" class="w-16 h-auto rounded border" />
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div class="font-bold text-destructive">
                -Rp {{ item.nominal.toLocaleString("id-ID") }}
              </div>
              <div class="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8"
                  @click="$emit('edit', item)"
                >
                  <Edit class="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 text-destructive"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Pengeluaran ini akan dihapus secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction @click="$emit('delete', item.id)">
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="pengeluaran.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          {{
            hasActiveFilter
              ? "Tidak ada data yang sesuai dengan filter"
              : "Belum ada catatan pengeluaran"
          }}
        </div>
      </div>

      <!-- Desktop View -->
      <div class="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Bukti</TableHead>
              <TableHead class="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in pengeluaran" :key="item.id">
              <TableCell>
                {{
                  format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })
                }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{
                      backgroundColor: getJenisById(item.jenisId)?.warna,
                    }"
                  />
                  <Badge variant="outline" class="text-xs">
                    {{ getJenisById(item.jenisId)?.nama }}
                  </Badge>
                </div>
              </TableCell>
              <TableCell class="font-medium">{{ item.deskripsi }}</TableCell>
              <TableCell class="text-destructive">
                Rp {{ item.nominal.toLocaleString("id-ID") }}
              </TableCell>
              <TableCell>
                <img
                  v-if="item.bukti"
                  :src="item.bukti"
                  alt="Bukti"
                  class="h-16 w-auto rounded border"
                />
                <span v-else class="text-muted-foreground text-sm">-</span>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="$emit('edit', item)"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger as-child>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="text-destructive hover:text-destructive"
                      >
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Pengeluaran "{{ item.deskripsi }}" akan dihapus secara
                          permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction @click="$emit('delete', item.id)">
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-if="pengeluaran.length === 0">
              <TableCell
                colspan="6"
                class="text-center py-8 text-muted-foreground"
              >
                {{
                  hasActiveFilter
                    ? "Tidak ada data yang sesuai dengan filter"
                    : "Belum ada catatan pengeluaran"
                }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</template>
