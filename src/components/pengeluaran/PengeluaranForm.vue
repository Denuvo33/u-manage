<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-vue-next";
import type { Pengeluaran } from "@/types";
import { useJenisPengeluaran } from "@/composables/useJenisPengeluaran";

interface Props {
  editId?: string | null;
  editData?: Pengeluaran;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  save: [
    data: {
      tanggal: string;
      deskripsi: string;
      nominal: number;
      jenisId: string;
      buktiFile?: File | null;
    }
  ];
  cancel: [];
}>();

const { sortedJenis, defaultJenisId, getJenisById, loadJenisPengeluaran } =
  useJenisPengeluaran();

// Form state
const tanggalPengeluaran = ref<string>(new Date().toISOString().split("T")[0]);
const deskripsiPengeluaran = ref<string>("");
const nominalPengeluaran = ref<number>(0);
const jenisIdPengeluaran = ref<string>("");
const buktiFile = ref<File | null>(null);

// Initialize form
const initializeForm = () => {
  if (props.editData) {
    console.log("edit data", props.editData);
    tanggalPengeluaran.value = new Date(props.editData.tanggal)
      .toISOString()
      .split("T")[0];
    deskripsiPengeluaran.value = props.editData.deskripsi;
    nominalPengeluaran.value = props.editData.nominal;
    jenisIdPengeluaran.value = props.editData.jenisId || defaultJenisId.value;
    buktiFile.value = null;
  } else {
    console.log("new data");
    tanggalPengeluaran.value = new Date().toISOString().split("T")[0];
    deskripsiPengeluaran.value = "";
    nominalPengeluaran.value = 0;
    jenisIdPengeluaran.value = defaultJenisId.value;
    buktiFile.value = null;
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    buktiFile.value = target.files[0];
  }
};

const handleSave = () => {
  emit("save", {
    tanggal: tanggalPengeluaran.value,
    deskripsi: deskripsiPengeluaran.value,
    nominal: nominalPengeluaran.value,
    jenisId: jenisIdPengeluaran.value,
    buktiFile: buktiFile.value,
  });
};

const isFormValid = () => {
  return (
    deskripsiPengeluaran.value.trim() &&
    nominalPengeluaran.value > 0 &&
    jenisIdPengeluaran.value
  );
};

// Watch for defaultJenisId changes
watch(defaultJenisId, (newDefaultId) => {
  if (newDefaultId && !jenisIdPengeluaran.value) {
    jenisIdPengeluaran.value = newDefaultId;
  }
});

onMounted(() => {
  initializeForm();
  loadJenisPengeluaran();
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        {{ editId ? "Edit Pengeluaran" : "Tambah Pengeluaran" }}
      </CardTitle>
      <CardDescription>
        {{ editId ? "Perbarui" : "Tambahkan" }} catatan pengeluaran kas
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="tanggal">Tanggal Pengeluaran</Label>
          <Input
            id="tanggal"
            type="date"
            class="w-full"
            v-model="tanggalPengeluaran"
            :max="new Date().toISOString().split('T')[0]"
          />
        </div>

        <div class="space-y-2">
          <Label for="nominal">Nominal</Label>
          <Input
            id="nominal"
            type="number"
            class="w-full"
            placeholder="Masukkan nominal pengeluaran"
            v-model="nominalPengeluaran"
          />
        </div>
      </div>

      <div class="space-y-2">
        <Label for="jenis">Jenis Pengeluaran</Label>
        <select
          id="jenis"
          v-model="jenisIdPengeluaran"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Pilih jenis pengeluaran</option>
          <option
            v-for="jenis in sortedJenis"
            :key="jenis.id"
            :value="jenis.id"
          >
            {{ jenis.nama }}
          </option>
        </select>
        <!-- Show selected jenis with color -->
        <div
          v-if="jenisIdPengeluaran"
          class="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <div
            class="w-3 h-3 rounded-full"
            :style="{
              backgroundColor: getJenisById(jenisIdPengeluaran)?.warna,
            }"
          />
          {{ getJenisById(jenisIdPengeluaran)?.nama }}
        </div>
      </div>

      <div class="space-y-2">
        <Label for="deskripsi">Deskripsi Pengeluaran</Label>
        <Input
          id="deskripsi"
          type="text"
          class="w-full"
          placeholder="Contoh: Beli bahan masak, transportasi, dll."
          v-model="deskripsiPengeluaran"
        />
      </div>

      <div class="space-y-2">
        <Label for="bukti">Bukti Struk (opsional)</Label>
        <Input
          id="bukti"
          class="w-full"
          type="file"
          accept="image/*"
          @change="handleFileChange"
        />
      </div>

      <div class="flex justify-end space-x-2">
        <Button variant="outline" @click="$emit('cancel')"> Batal </Button>
        <Button @click="handleSave" :disabled="!isFormValid()">
          <Save class="h-4 w-4 mr-2" />
          {{ editId ? "Update" : "Simpan" }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
