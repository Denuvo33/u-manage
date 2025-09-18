// utils/dataMigration.ts
import type { Pengeluaran, JenisPengeluaran } from "@/types";

export const useDataMigration = () => {
  
  const createDefaultJenisPengeluaran = (): JenisPengeluaran[] => {
    return [
      {
        id: "default-umum",
        nama: "Umum",
        warna: "#6B7280",
        isDefault: true,
        createdAt: new Date()
      }
    ];
  };

  const migrateExistingData = () => {
    console.log("🔄 Checking for data migration...");
    
    // Cek apakah jenisPengeluaran sudah ada
    let jenisPengeluaran: JenisPengeluaran[] = [];
    const savedJenis = localStorage.getItem("jenisPengeluaran");
    
    if (!savedJenis) {
      console.log("📝 Creating default jenis pengeluaran...");
      jenisPengeluaran = createDefaultJenisPengeluaran();
      localStorage.setItem("jenisPengeluaran", JSON.stringify(jenisPengeluaran));
    } else {
      jenisPengeluaran = JSON.parse(savedJenis);
    }

    // Pastikan ada setidaknya satu jenis default
    const hasDefault = jenisPengeluaran.some(j => j.isDefault);
    if (!hasDefault && jenisPengeluaran.length > 0) {
      jenisPengeluaran[0].isDefault = true;
      localStorage.setItem("jenisPengeluaran", JSON.stringify(jenisPengeluaran));
    }

    // Migrate existing pengeluaran data
    const savedPengeluaran = localStorage.getItem("pengeluaran");
    if (savedPengeluaran) {
      const pengeluaran: Pengeluaran[] = JSON.parse(savedPengeluaran);
      let needsUpdate = false;
      const defaultJenisId = jenisPengeluaran.find(j => j.isDefault)?.id || jenisPengeluaran[0]?.id;

      pengeluaran.forEach(p => {
        // Migrate data yang belum punya jenisId
        if (!p.jenisId) {
          p.jenisId = defaultJenisId;
          needsUpdate = true;
        }
        
        // Ensure tanggal is a proper Date object
        if (typeof p.tanggal === 'string') {
          p.tanggal = new Date(p.tanggal);
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        console.log(`📝 Migrated ${pengeluaran.length} pengeluaran records`);
        localStorage.setItem("pengeluaran", JSON.stringify(pengeluaran));
      }
    }

    console.log("✅ Data migration completed");
    return {
      jenisPengeluaran,
      migrationPerformed: savedJenis === null
    };
  };

  const validateDataIntegrity = () => {
    console.log("🔍 Validating data integrity...");
    
    const jenisPengeluaran: JenisPengeluaran[] = JSON.parse(
      localStorage.getItem("jenisPengeluaran") || "[]"
    );
    const pengeluaran: Pengeluaran[] = JSON.parse(
      localStorage.getItem("pengeluaran") || "[]"
    );

    const jenisIds = new Set(jenisPengeluaran.map(j => j.id));
    const orphanedRecords: string[] = [];

    // Cek pengeluaran yang referensi jenisId tidak valid
    pengeluaran.forEach(p => {
      if (p.jenisId && !jenisIds.has(p.jenisId)) {
        orphanedRecords.push(p.id);
      }
    });

    if (orphanedRecords.length > 0) {
      console.warn(`⚠️ Found ${orphanedRecords.length} orphaned pengeluaran records`);
      
      // Fix orphaned records by assigning them to default jenis
      const defaultJenis = jenisPengeluaran.find(j => j.isDefault);
      if (defaultJenis) {
        pengeluaran.forEach(p => {
          if (orphanedRecords.includes(p.id)) {
            p.jenisId = defaultJenis.id;
          }
        });
        localStorage.setItem("pengeluaran", JSON.stringify(pengeluaran));
        console.log("✅ Fixed orphaned records");
      }
    }

    console.log("✅ Data integrity check completed");
    return {
      totalJenis: jenisPengeluaran.length,
      totalPengeluaran: pengeluaran.length,
      orphanedRecords: orphanedRecords.length,
      hasDefault: jenisPengeluaran.some(j => j.isDefault)
    };
  };

  return {
    migrateExistingData,
    validateDataIntegrity,
    createDefaultJenisPengeluaran
  };
};