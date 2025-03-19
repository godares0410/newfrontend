// components/Siswa/DataSiswa/SiswaTable.tsx
import React from 'react';
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";

type Siswa = {
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

type SiswaTableProps = {
    siswaData: Siswa[];
    sortOrder: "asc" | "desc";
    onSortToggle: () => void;
};

const SiswaTable: React.FC<SiswaTableProps> = ({ siswaData, sortOrder, onSortToggle }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-slate-100">
                        <th className="px-4 py-2 border-b border-slate-200 text-center">No</th>
                        <th className="px-4 py-2 border-b border-slate-200 text-center flex items-center justify-center">
                            <span>Nama</span>
                            <button onClick={onSortToggle} className="ml-2">
                                {sortOrder === "asc" ? <FaArrowDownShortWide /> : <FaArrowUpShortWide />}
                            </button>
                        </th>
                        <th className="px-4 py-2 border-b border-slate-200 text-center">NIS</th>
                        <th className="px-4 py-2 border-b border-slate-200 text-center">NISN</th>
                        <th className="px-4 py-2 border-b border-slate-200 text-center">Kelas</th>
                        <th className="px-4 py-2 border-b border-slate-200 text-center">Rombel</th>
                        <th className="px-4 py-2 border-b border-slate-200 text-center">Ekskul</th>
                    </tr>
                </thead>
                <tbody>
                    {siswaData.map((siswa, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} text-slate-600`}>
                            <td className="px-4 py-2 border-b border-slate-200 text-center">{index + 1}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nama_siswa}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nis}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nisn}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nama_kelas}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nama_rombel}</td>
                            <td className="px-4 py-2 border-b border-slate-200 text-center">
                                {siswa.ekskul.map((e, i) => (
                                    <span key={i} className="mr-1">{e.nama}</span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SiswaTable;