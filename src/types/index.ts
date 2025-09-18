// types/index.ts
export interface Anggota {
  id: string;
  nama: string;
  totalSetoran: number;
  createdAt: Date;
}

export interface Setoran {
  id: string;
  anggotaId: string;
  minggu: number;
  nominal: number;
  tanggal: Date;
  jenis: 'full' | 'partial' | 'full_all' | 'deposit';
  groupId?: string;
  deskripsi?: string;
}

export interface JenisPengeluaran {
  id: string;
  nama: string;
  warna: string; 
  createdAt: Date;
  isDefault: boolean; 
}

export interface Pengeluaran {
  id: string;
  tanggal: Date;
  deskripsi: string;
  nominal: number;
  bukti?: string;
  jenisId: string;
}

export interface AppState {
  anggota: Anggota[];
  setoran: Setoran[];
  pengeluaran: Pengeluaran[];
  jenisPengeluaran: JenisPengeluaran[];
}

// Filter options untuk pengeluaran
export interface PengeluaranFilter {
  jenisId?: string;
  tanggalMulai?: Date;
  tanggalSelesai?: Date;
  search?: string;
}

// Summary data untuk statistik
export interface PengeluaranSummary {
  totalSemua: number;
  totalPerJenis: { [jenisId: string]: number };
  jumlahTransaksi: number;
  rataRata: number;
}

