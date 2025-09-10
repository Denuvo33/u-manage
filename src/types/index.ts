
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

export interface Pengeluaran {
  id: string;
  tanggal: Date;
  deskripsi: string;
  nominal: number;
  bukti?: string;
}

export interface AppState {
  anggota: Anggota[];
  setoran: Setoran[];
  pengeluaran: Pengeluaran[];
}