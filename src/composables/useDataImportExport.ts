import { toast } from "vue-sonner";

export const useDataImportExport = () => {
const exportData = (includeImage: boolean = false) => {
  const anggotaData = JSON.parse(localStorage.getItem("anggota") || "[]");
  const setoranData = JSON.parse(localStorage.getItem("setoran") || "[]");
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
};

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const text = await file.text();
      const imported = JSON.parse(text);

      const current = {
        anggota: JSON.parse(localStorage.getItem("anggota") || "[]"),
        setoran: JSON.parse(localStorage.getItem("setoran") || "[]"),
        pengeluaran: JSON.parse(localStorage.getItem("pengeluaran") || "[]"),
      };

      const merged = {
        anggota: mergeById(current.anggota, imported.anggota),
        setoran: mergeById(current.setoran, imported.setoran),
        pengeluaran: mergeById(current.pengeluaran, imported.pengeluaran),
      };

      localStorage.setItem("anggota", JSON.stringify(merged.anggota));
      localStorage.setItem("setoran", JSON.stringify(merged.setoran));
      localStorage.setItem("pengeluaran", JSON.stringify(merged.pengeluaran));

      location.reload();
      toast.success("Data JSON berhasil diimport & digabung!", {
        duration: 5000,
      });
    };
    input.click();
  };

  const exportCsv = () => {
    const anggota = JSON.parse(localStorage.getItem("anggota") || "[]");
    const setoran = JSON.parse(localStorage.getItem("setoran") || "[]");
    const pengeluaran = JSON.parse(localStorage.getItem("pengeluaran") || "[]");

    const toCsv = (arr: any[]) => {
      if (arr.length === 0) return "";
      const headers = Object.keys(arr[0]);
      const rows = arr.map((obj) =>
        headers
          .map((h) => {
            let val = obj[h];
            if (h === "id" || h === "tanggal") {
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
      link.download = filename;
      link.click();
    };

    saveFile(toCsv(anggota), "anggota.csv");
    saveFile(toCsv(setoran), "setoran.csv");
    saveFile(toCsv(pengeluaran), "pengeluaran.csv");
  };

  const importCsv = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files: FileList = e.target.files;
      if (!files.length) return;

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
      };

      for (const file of Array.from(files)) {
        const parsed = await parseCsv(file);

        if (file.name.includes("anggota")) {
          current.anggota = mergeById(current.anggota, parsed);
        } else if (file.name.includes("setoran")) {
          current.setoran = mergeById(current.setoran, parsed);
        } else if (file.name.includes("pengeluaran")) {
          current.pengeluaran = mergeById(current.pengeluaran, parsed);
        }
      }

      localStorage.setItem("anggota", JSON.stringify(current.anggota));
      localStorage.setItem("setoran", JSON.stringify(current.setoran));
      localStorage.setItem("pengeluaran", JSON.stringify(current.pengeluaran));

      location.reload();
      toast.success("Data CSV berhasil diimport & digabung!", {
        duration: 5000,
      });
    };
    input.click();
  };

  const mergeById = (existing: any[], incoming: any[]) => {
    const map = new Map(existing.map((item) => [item.id, item]));
    incoming.forEach((item) => {
     
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }else{
           if(item.totalSetoran > map.get(item.id)?.totalSetoran  ) {
          map.set(item.id, item);
        }
      }
    });
    return Array.from(map.values());
  };

  return {
    exportData,
    importData,
    exportCsv,
    importCsv,
  };
};