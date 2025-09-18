<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus } from "lucide-vue-next";
import type { JenisPengeluaran, Pengeluaran } from "@/types";
import { useJenisPengeluaran } from "@/composables/useJenisPengeluaran";

interface Props {
  open: boolean;
  pengeluaran: Pengeluaran[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  "update-pengeluaran": [];
}>();

const {
  sortedJenis,
  defaultJenisId,
  colors,
  tambahJenis,
  editJenis,
  hapusJenis,
  loadJenisPengeluaran,
} = useJenisPengeluaran();

// Jenis form state
const jenisNama = ref<string>("");
const jenisWarna = ref<string>(colors[0]);
const jenisEditId = ref<string | null>(null);

const openTambahJenis = () => {
  jenisNama.value = "";
  jenisWarna.value = colors[Math.floor(Math.random() * colors.length)];
  jenisEditId.value = null;
};

const openEditJenis = (jenis: JenisPengeluaran) => {
  jenisNama.value = jenis.nama;
  jenisWarna.value = jenis.warna;
  jenisEditId.value = jenis.id;
};

const resetJenisForm = () => {
  jenisNama.value = "";
  jenisWarna.value = colors[0];
  jenisEditId.value = null;
};

const closeDialog = () => {
  resetJenisForm();
  emit("update:open", false);
};

const simpanJenis = () => {
  if (!jenisNama.value.trim()) return;

  try {
    if (jenisEditId.value) {
      editJenis(jenisEditId.value, jenisNama.value, jenisWarna.value);
    } else {
      tambahJenis(jenisNama.value, jenisWarna.value);
    }
    resetJenisForm();
  } catch (error) {
    alert((error as Error).message);
  }
};

const confirmHapusJenis = (jenis: JenisPengeluaran) => {
  // const pengeluaranWithJenis = props.pengeluaran.filter(
  //   (p) => p.jenisId === jenis.id
  // );

  // let message = `Yakin ingin menghapus jenis "${jenis.nama}"?`;
  // if (pengeluaranWithJenis.length > 0) {
  //   message += `\n\nAda ${pengeluaranWithJenis.length} pengeluaran yang menggunakan jenis ini. Data tersebut akan dipindah ke jenis "Umum".`;
  // }

  // const confirmed = confirm(message);
  // if (confirmed) {
  // }
  handleHapusJenis(jenis.id);
};

const handleHapusJenis = (id: string) => {
  try {
    // Pindahkan pengeluaran ke jenis default
    const pengeluaranWithJenis = props.pengeluaran.filter(
      (p) => p.jenisId === id
    );
    if (pengeluaranWithJenis.length > 0) {
      pengeluaranWithJenis.forEach((p) => {
        console.log("pindah jenis", p);
        p.jenisId = defaultJenisId.value;
        console.log("pindah jenis selesai", p.jenisId);
      });
      emit("update-pengeluaran");
    }

    hapusJenis(id);
  } catch (error) {
    alert((error as Error).message);
  }
};

onMounted(() => {
  loadJenisPengeluaran();
});
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Kelola Jenis Pengeluaran</DialogTitle>
        <DialogDescription>
          Tambah, edit, atau hapus jenis pengeluaran
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4">
        <!-- Form Tambah/Edit Jenis -->
        <div class="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div class="space-y-2">
            <Label for="jenisNama">Nama Jenis</Label>
            <Input
              id="jenisNama"
              v-model="jenisNama"
              placeholder="Masukkan nama jenis pengeluaran"
              @keyup.enter="simpanJenis"
            />
          </div>
          <div class="space-y-2">
            <Label>Warna</Label>
            <div class="flex gap-2 flex-wrap">
              <div
                v-for="color in colors"
                :key="color"
                class="w-8 h-8 rounded-full cursor-pointer border-2 transition-all hover:scale-110"
                :class="
                  jenisWarna === color
                    ? 'border-foreground scale-110 ring-2 ring-ring'
                    : 'border-muted'
                "
                :style="{ backgroundColor: color }"
                @click="jenisWarna = color"
              />
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <div
                class="w-4 h-4 rounded-full border"
                :style="{ backgroundColor: jenisWarna }"
              />
              Warna terpilih
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" size="sm" @click="resetJenisForm">
              Batal
            </Button>
            <Button
              size="sm"
              @click="simpanJenis"
              :disabled="!jenisNama.trim()"
            >
              {{ jenisEditId ? "Update" : "Tambah" }}
            </Button>
          </div>
        </div>

        <!-- List Jenis -->
        <div class="space-y-2">
          <div class="text-sm font-medium text-muted-foreground">
            Daftar Jenis ({{ sortedJenis.length }})
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="jenis in sortedJenis"
              :key="jenis.id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-4 h-4 rounded-full border"
                  :style="{ backgroundColor: jenis.warna }"
                />
                <span class="font-medium">{{ jenis.nama }}</span>
                <Badge
                  v-if="jenis.isDefault"
                  variant="secondary"
                  class="text-xs"
                >
                  Default
                </Badge>
              </div>
              <div class="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8"
                  @click="openEditJenis(jenis)"
                >
                  <Edit class="h-3 w-3" />
                </Button>
                <Button
                  v-if="!jenis.isDefault"
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 text-destructive hover:text-destructive"
                  @click="confirmHapusJenis(jenis)"
                >
                  <Trash2 class="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <Button class="w-full" @click="openTambahJenis">
            <Plus class="h-4 w-4 mr-2" />
            Tambah Jenis Baru
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog"> Selesai </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
