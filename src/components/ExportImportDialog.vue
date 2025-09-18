<!-- components/ExportImportDialog.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Upload,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-vue-next";
import { useDataImportExport } from "@/composables/useDataImportExport";

const { exportData, importData } = useDataImportExport();

const showExportDialog = ref(false);
const showImportDialog = ref(false);
const includeImages = ref(false);
const isExporting = ref(false);
const isImporting = ref(false);

// Get data statistics
const getDataStats = () => {
  const anggota = JSON.parse(localStorage.getItem("anggota") || "[]");
  const setoran = JSON.parse(localStorage.getItem("setoran") || "[]");
  const pengeluaran = JSON.parse(localStorage.getItem("pengeluaran") || "[]");
  const jenisPengeluaran = JSON.parse(
    localStorage.getItem("jenisPengeluaran") || "[]"
  );

  const pengeluaranWithImages = pengeluaran.filter((p: any) => p.bukti).length;

  return {
    anggota: anggota.length,
    setoran: setoran.length,
    pengeluaran: pengeluaran.length,
    jenisPengeluaran: jenisPengeluaran.length,
    pengeluaranWithImages,
  };
};

const stats = getDataStats();

const handleExport = async () => {
  isExporting.value = true;
  try {
    const exportInfo = exportData(includeImages.value);
    console.log("Export completed:", exportInfo);
    showExportDialog.value = false;
  } catch (error) {
    console.error("Export error:", error);
    alert("Gagal melakukan export data");
  } finally {
    isExporting.value = false;
  }
};

const handleImport = async () => {
  isImporting.value = true;
  try {
    await importData();
    showImportDialog.value = false;
  } catch (error) {
    console.error("Import error:", error);
    alert("Gagal melakukan import data");
  } finally {
    isImporting.value = false;
  }
};
</script>

<template>
  <div class="flex gap-2">
    <!-- Export Dialog -->
    <Dialog v-model:open="showExportDialog">
      <DialogTrigger as-child>
        <Button variant="outline">
          <Download class="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Download class="h-5 w-5" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Ekspor semua data ke file JSON untuk backup atau sinkronisasi
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <!-- Data Summary -->
          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm">Data yang akan diekspor</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span>Anggota</span>
                <Badge variant="secondary">{{ stats.anggota }}</Badge>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Setoran</span>
                <Badge variant="secondary">{{ stats.setoran }}</Badge>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Pengeluaran</span>
                <Badge variant="secondary">{{ stats.pengeluaran }}</Badge>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Jenis Pengeluaran</span>
                <Badge variant="secondary">{{ stats.jenisPengeluaran }}</Badge>
              </div>
              <div
                v-if="stats.pengeluaranWithImages > 0"
                class="flex justify-between items-center text-sm border-t pt-2"
              >
                <span class="flex items-center gap-1">
                  <Image class="h-3 w-3" />
                  Bukti Gambar
                </span>
                <Badge variant="outline">{{
                  stats.pengeluaranWithImages
                }}</Badge>
              </div>
            </CardContent>
          </Card>

          <!-- Export Options -->
          <div class="space-y-3">
            <Label class="text-sm font-medium">Opsi Export</Label>
            <div class="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox id="includeImages" v-model:checked="includeImages" />
              <div class="flex-1">
                <Label
                  for="includeImages"
                  class="text-sm font-medium cursor-pointer"
                >
                  Sertakan Gambar Bukti
                </Label>
                <p class="text-xs text-muted-foreground mt-1">
                  File akan lebih besar jika menyertakan gambar
                </p>
              </div>
            </div>
          </div>

          <!-- Info Cards -->
          <div class="space-y-2">
            <div
              class="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <Info class="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div class="text-xs text-blue-800">
                <p class="font-medium">Format JSON</p>
                <p>
                  Data akan disimpan dalam format JSON yang mudah dibaca dan
                  dipindahkan antar perangkat.
                </p>
              </div>
            </div>
            <div
              v-if="includeImages && stats.pengeluaranWithImages > 0"
              class="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <AlertCircle
                class="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0"
              />
              <div class="text-xs text-yellow-800">
                <p class="font-medium">Ukuran File Besar</p>
                <p>
                  Export dengan gambar akan menghasilkan file yang lebih besar
                  dan membutuhkan waktu lebih lama.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showExportDialog = false">
            Batal
          </Button>
          <Button @click="handleExport" :disabled="isExporting">
            <Download class="h-4 w-4 mr-2" />
            {{ isExporting ? "Mengekspor..." : "Export Sekarang" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Import Dialog -->
    <Dialog v-model:open="showImportDialog">
      <DialogTrigger as-child>
        <Button variant="outline">
          <Upload class="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Upload class="h-5 w-5" />
            Import Data
          </DialogTitle>
          <DialogDescription>
            Impor data dari file JSON untuk menggabungkan dengan data yang ada
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <!-- Current Data Summary -->
          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm">Data saat ini</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span>Anggota</span>
                <Badge variant="secondary">{{ stats.anggota }}</Badge>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Setoran</span>
                <Badge variant="secondary">{{ stats.setoran }}</Badge>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Pengeluaran</span>
                <Badge variant="secondary">{{ stats.pengeluaran }}</Badge>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span>Jenis Pengeluaran</span>
                <Badge variant="secondary">{{ stats.jenisPengeluaran }}</Badge>
              </div>
            </CardContent>
          </Card>

          <!-- Import Info -->
          <div class="space-y-2">
            <div
              class="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <CheckCircle
                class="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0"
              />
              <div class="text-xs text-green-800">
                <p class="font-medium">Penggabungan Cerdas</p>
                <p>
                  Data akan digabungkan dengan data yang ada. Data duplikat akan
                  diperbarui, data baru akan ditambahkan.
                </p>
              </div>
            </div>
            <div
              class="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <Info class="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div class="text-xs text-blue-800">
                <p class="font-medium">Format yang Didukung</p>
                <p>
                  Hanya file JSON yang diekspor dari aplikasi ini yang dapat
                  diimpor dengan aman.
                </p>
              </div>
            </div>
            <div
              class="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <AlertCircle
                class="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0"
              />
              <div class="text-xs text-yellow-800">
                <p class="font-medium">Backup Direkomendasikan</p>
                <p>
                  Sebaiknya lakukan export data saat ini sebelum import untuk
                  backup.
                </p>
              </div>
            </div>
          </div>

          <!-- File Selection -->
          <div class="space-y-2">
            <Label class="text-sm font-medium">Pilih File JSON</Label>
            <div
              class="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
            >
              <FileText class="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p class="text-sm text-muted-foreground mb-3">
                Klik tombol di bawah untuk memilih file JSON
              </p>
              <Button
                variant="outline"
                @click="handleImport"
                :disabled="isImporting"
              >
                <Upload class="h-4 w-4 mr-2" />
                {{ isImporting ? "Mengimpor..." : "Pilih File & Import" }}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showImportDialog = false">
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
