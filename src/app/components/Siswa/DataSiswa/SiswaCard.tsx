// SiswaCard.tsx
import Image from "next/image";

// Definisi tipe data untuk Siswa
type Siswa = {
    nama: string;
    kelas: string;
    rombel: string;
    nis: string;
    nisn: string;
    ekskul: string[];
    foto: string;
};

// Definisi tipe data untuk Ekskul
type Ekskul = {
    nama: string;
    warna: string;
};

// Definisi tipe data untuk props SiswaCard
type SiswaCardProps = {
    siswa: Siswa; // Tipe data untuk parameter siswa
    ekskulData: Ekskul[]; // Tipe data untuk parameter ekskulData
};

const SiswaCard: React.FC<SiswaCardProps> = ({ siswa, ekskulData }) => {
    // Foto default jika foto siswa tidak tersedia
    const fotoSiswa = siswa.foto || "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg";

    return (
        <div className="h-44 bg-white shadow-lg flex rounded-lg p-2">
            {/* Bagian Foto Siswa */}
            <div className="w-[30%] h-full rounded-lg overflow-hidden relative">
                <Image
                    src={`/img/siswa/sabilillah/${fotoSiswa}`}
                    alt={`Foto ${siswa.nama}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 144px"
                    className="object-cover"
                    priority
                />
            </div>
            {/* Bagian Informasi Siswa */}
            <div className="w-[70%] flex-1 h-full px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-none">
                {/* Status Aktif (Contoh: Titik Hijau) */}
                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full right-2 top-2"></div>

                {/* Nama Siswa */}
                <div className="text-xl font-bold text-slate-700 truncate">
                    {siswa.nama}
                </div>

                {/* Kelas dan Rombel */}
                <div className="text-sm text-slate-700 truncate">{siswa.kelas}</div>
                <div className="text-xs text-slate-500 truncate">{siswa.rombel}</div>

                {/* NISN dan NIS */}
                <div className="flex flex-col text-xs text-slate-500 mt-1">
                    <div className="flex">
                        <span className="w-12">NISN</span>
                        <span className="truncate flex-1">: {siswa.nisn}</span>
                    </div>
                    <div className="flex">
                        <span className="w-12">NIS</span>
                        <span className="truncate flex-1">: {siswa.nis}</span>
                    </div>
                </div>

                {/* Daftar Ekskul */}
                <div className="flex flex-wrap gap-1 mt-2">
                    {siswa.ekskul.length > 0 ? (
                        siswa.ekskul.map((ekskul, idx) => {
                            const ekskulInfo = ekskulData.find(e => e.nama === ekskul);
                            return ekskulInfo ? (
                                <div
                                    key={idx}
                                    className="text-xs text-white px-2 py-1 rounded-md"
                                    style={{ backgroundColor: ekskulInfo.warna }}
                                >
                                    {ekskulInfo.nama}
                                </div>
                            ) : null;
                        })
                    ) : (
                        <div className="text-xs text-slate-400">Tidak ada ekskul</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SiswaCard;