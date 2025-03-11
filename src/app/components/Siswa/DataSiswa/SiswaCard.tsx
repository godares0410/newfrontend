// SiswaCard.tsx
"use client";

import Image from "next/image";

type Siswa = {
    nama: string;
    kelas: string;
    rombel: string;
    nis: string;
    nisn: string;
    ekskul: string[];
    foto: string;
};

type Ekskul = {
    nama: string;
    warna: string;
};

type SiswaCardProps = {
    siswa: Siswa;
    ekskulData: Ekskul[];
};


const SiswaCard: React.FC<SiswaCardProps> = ({ siswa, ekskulData }) => {
    return (
        <div className="h-44 bg-white shadow-lg flex rounded-lg p-2">
            <div className="w-36 h-full rounded-lg overflow-hidden">
                <Image
                    src={siswa.foto}
                    alt="Siswa Icon"
                    width={144}
                    height={176}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="relative h-full w-full px-1 overflow-scroll scrollbar-hidden">
                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full right-0"></div>
                <div className="text-xl font-bold text-slate-700 truncate max-w-[98%]">
                    {siswa.nama}
                </div>

                <div className="text-sm text-slate-700 truncate max-w-[98%]">{siswa.kelas}</div>
                <div className="text-xs text-slate-500 truncate max-w-[98%]">{siswa.rombel}</div>
                <div className="flex flex-col text-xs text-slate-500">
                    <div className="flex ">
                        <span className="w-12 mb-1">NISN</span> <span className="truncate max-w-[80%]">: {siswa.nisn}</span>
                    </div>
                    <div className="flex">
                        <span className="w-12 mb-1">NIS</span> <span className="truncate max-w-[80%]">: {siswa.nis}</span>
                    </div>
                </div>
                <div className="flex gap-1 mt-1">
                    {siswa.ekskul.map((ekskul, idx) => {
                        const ekskulInfo = ekskulData.find(e => e.nama === ekskul);
                        return ekskulInfo ? (
                            <div key={idx} className={`text-xs text-white w-fit p-1 rounded-md ${ekskulInfo.warna}`}>
                                {ekskulInfo.nama}
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SiswaCard;