import { toast } from "vue-sonner";
import type { JenisPengeluaran } from "@/types";

export const useDataImportExport = () => {
  
  const mergeById = (existing: any[], incoming: any[]) => {
    const map = new Map(existing.map((item) => [item.id, item]));
    incoming.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      } else {
        if (item.totalSetoran > map.get(item.id)?.totalSetoran) {
          map.set(item.id, item);
        }
      }
    });
    return Array.from(map.values());
  };

  // Khusus untuk merge jenis pengeluaran berdasarkan nama (case insensitive)
  const mergeJenisPengeluaran = (existing: JenisPengeluaran[], incoming: JenisPengeluaran[]) => {
    const existingNames = new Set(existing.map(item => item.nama.toLowerCase()));
    const merged = [...existing];
    
    incoming.forEach(item => {
      // Cek berdasarkan nama untuk jenis pengeluaran (case insensitive)
      if (!existingNames.has(item.nama.toLowerCase())) {
        // Generate ID baru jika belum ada
        const newItem = {
          ...item,
          id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(item.createdAt || new Date())
        };
        merged.push(newItem);
        existingNames.add(item.nama.toLowerCase());
      }
    });
    
    return merged;
  };

  const exportData = (includeImage: boolean = false) => {
    const anggotaData = JSON.parse(localStorage.getItem("anggota") || "[]");
    const setoranData = JSON.parse(localStorage.getItem("setoran") || "[]");
    const jenisPengeluaranData = JSON.parse(localStorage.getItem("jenisPengeluaran") || "[]");
    let pengeluaranData = JSON.parse(localStorage.getItem("pengeluaran") || "[]");

    if (!includeImage) {
      pengeluaranData = pengeluaranData.map((item: any) => {
        const { bukti, ...itemWithoutBukti } = item;
        return itemWithoutBukti;
      });
    }

    const data = {
      anggota: anggotaData,
      setoran: setoranData,
      pengeluaran: pengeluaranData,
      jenisPengeluaran: jenisPengeluaranData, // Tambahan untuk jenis pengeluaran
      exportInfo: {
        version: "1.1.0",
        exportedAt: new Date().toISOString(),
        includeImages: includeImage,
        totalRecords: {
          anggota: anggotaData.length,
          setoran: setoranData.length,
          pengeluaran: pengeluaranData.length,
          jenisPengeluaran: jenisPengeluaranData.length
        }
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split('T')[0];
    const imageStatus = includeImage ? 'with-images' : 'no-images';
    link.download = `u-kelola-data-${imageStatus}-${timestamp}.json`;
    link.click();

    URL.revokeObjectURL(link.href);
    
    // Toast notification
    toast.success(`Data berhasil diekspor ${includeImage ? 'dengan gambar' : 'tanpa gambar'}!`, {
      duration: 3000,
    });
    
    return data.exportInfo;
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);

        const current = {
          anggota: JSON.parse(localStorage.getItem("anggota") || "[]"),
          setoran: JSON.parse(localStorage.getItem("setoran") || "[]"),
          pengeluaran: JSON.parse(localStorage.getItem("pengeluaran") || "[]"),
          jenisPengeluaran: JSON.parse(localStorage.getItem("jenisPengeluaran") || "[]"),
        };

        const merged = {
          anggota: mergeById(current.anggota, imported.anggota || []),
          setoran: mergeById(current.setoran, imported.setoran || []),
          pengeluaran: mergeById(current.pengeluaran, imported.pengeluaran || []),
          jenisPengeluaran: mergeJenisPengeluaran(current.jenisPengeluaran, imported.jenisPengeluaran || []),
        };

        localStorage.setItem("anggota", JSON.stringify(merged.anggota));
        localStorage.setItem("setoran", JSON.stringify(merged.setoran));
        localStorage.setItem("pengeluaran", JSON.stringify(merged.pengeluaran));
        localStorage.setItem("jenisPengeluaran", JSON.stringify(merged.jenisPengeluaran));

        // Show success message with import summary
        const importSummary = {
          anggota: merged.anggota.length - current.anggota.length,
          setoran: merged.setoran.length - current.setoran.length,
          pengeluaran: merged.pengeluaran.length - current.pengeluaran.length,
          jenisPengeluaran: merged.jenisPengeluaran.length - current.jenisPengeluaran.length,
        };

        let message = "Data JSON berhasil diimport & digabung!";
        const newItems = Object.values(importSummary).reduce((a, b) => a + b, 0);
        if (newItems > 0) {
          message += ` ${newItems} data baru ditambahkan.`;
        }

        toast.success(message, {
          duration: 5000,
        });

        location.reload();
      } catch (error) {
        console.error('Error importing data:', error);
        toast.error('Gagal mengimport data. Pastikan file JSON valid.', {
          duration: 5000,
        });
      }
    };
    input.click();
  };

  const exportCsv = () => {
    const anggota = JSON.parse(localStorage.getItem("anggota") || "[]");
    const setoran = JSON.parse(localStorage.getItem("setoran") || "[]");
    const pengeluaran = JSON.parse(localStorage.getItem("pengeluaran") || "[]");
    const jenisPengeluaran = JSON.parse(localStorage.getItem("jenisPengeluaran") || "[]");

    const toCsv = (arr: any[]) => {
      if (arr.length === 0) return "";
      const headers = Object.keys(arr[0]);
      const rows = arr.map((obj) =>
        headers
          .map((h) => {
            let val = obj[h];
            if (h === "id" || h === "tanggal" || h === "createdAt") {
              return `"${val}"`;
            }
            return val;
          })
          .join(",")
      );
      return [headers.join(","), ...rows].join("\n");
    };

    const saveFile = (csv: string, filename: string) => {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `${filename}-${timestamp}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    };

    saveFile(toCsv(anggota), "anggota");
    saveFile(toCsv(setoran), "setoran");
    saveFile(toCsv(pengeluaran), "pengeluaran");
    saveFile(toCsv(jenisPengeluaran), "jenis-pengeluaran"); // Tambahan export CSV jenis

    toast.success("Data CSV berhasil diekspor!", {
      duration: 3000,
    });
  };

  const importCsv = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files: FileList = e.target.files;
      if (!files.length) return;

      try {
        const parseCsv = async (file: File) => {
          const text = await file.text();
          const [headerLine, ...lines] = text
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
          const headers = headerLine.split(",");
          return lines.map((line) => {
            const values = line.split(",").map((v) => v.replace(/^"|"$/g, ""));
            const obj: any = {};
            headers.forEach((h, i) => {
              if (h === "nominal") {
                obj[h] = Number(values[i]) || 0;
              } else if (h === "isDefault") {
                obj[h] = values[i] === 'true';
              } else if (h === "tanggal" || h === "createdAt") {
                obj[h] = new Date(values[i]);
              } else {
                obj[h] = values[i];
              }
            });
            return obj;
          });
        };

        const current = {
          anggota: JSON.parse(localStorage.getItem("anggota") || "[]"),
          setoran: JSON.parse(localStorage.getItem("setoran") || "[]"),
          pengeluaran: JSON.parse(localStorage.getItem("pengeluaran") || "[]"),
          jenisPengeluaran: JSON.parse(localStorage.getItem("jenisPengeluaran") || "[]"),
        };

        for (const file of Array.from(files)) {
          const parsed = await parseCsv(file);

          if (file.name.includes("anggota")) {
            current.anggota = mergeById(current.anggota, parsed);
          } else if (file.name.includes("setoran")) {
            current.setoran = mergeById(current.setoran, parsed);
          } else if (file.name.includes("pengeluaran")) {
            current.pengeluaran = mergeById(current.pengeluaran, parsed);
          } else if (file.name.includes("jenis-pengeluaran")) {
            current.jenisPengeluaran = mergeJenisPengeluaran(current.jenisPengeluaran, parsed);
          }
        }

        localStorage.setItem("anggota", JSON.stringify(current.anggota));
        localStorage.setItem("setoran", JSON.stringify(current.setoran));
        localStorage.setItem("pengeluaran", JSON.stringify(current.pengeluaran));
        localStorage.setItem("jenisPengeluaran", JSON.stringify(current.jenisPengeluaran));

        toast.success("Data CSV berhasil diimport & digabung!", {
          duration: 5000,
        });

        location.reload();
      } catch (error) {
        console.error('Error importing CSV:', error);
        toast.error('Gagal mengimport CSV. Pastikan format file benar.', {
          duration: 5000,
        });
      }
    };
    input.click();
  };

  return {
    exportData,
    importData,
    exportCsv,
    importCsv,
    mergeById,
    mergeJenisPengeluaran
  };
};