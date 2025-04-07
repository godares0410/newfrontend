// components/types/SiswaCard.ts
export type Siswa = {
    id_siswa: number;
    kode_siswa: string;
    nisn: string;
    nis: string;
    nama_siswa: string;
    jenis_kelamin: string;
    tahun_masuk: number;
    foto: string;
    status: string;
    id_sekolah: number;
    created_at: string;
    updated_at: string;
    nama_kelas: string;
    nama_jurusan: string;
    nama_rombel: string;
    ekskul: { nama: string; warna: string }[];
};

export type SortConfig = {
    key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas' | 'nama_rombel';
    order: 'asc' | 'desc';
};

export type SiswaTableProps = {
    siswaData: Siswa[];
    sortConfig: SortConfig;
    onSort: (key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas' | 'nama_rombel') => void;
    totalData: number;
    currentPage: number;
    itemsPerPage: number;
    statusFilter: boolean; 
};

export type Ekskul = {
    nama: string;
    warna: string;
};
