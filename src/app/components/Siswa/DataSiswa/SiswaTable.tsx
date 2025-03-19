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
    totalData: number; // Total data dari database
    currentPage: number; // Halaman saat ini
    itemsPerPage: number; // Jumlah data per halaman
};

const SiswaTable: React.FC<SiswaTableProps> = ({
    siswaData,
    sortOrder,
    onSortToggle,
    totalData,
    currentPage,
    itemsPerPage,
}) => {

    const offset = (currentPage - 1) * itemsPerPage;

    return (
        <div className="w-full max-h-full overflow-y-auto overflow-x-auto border-gray-300">
            <table className="min-w-full bg-white border-collapse">
                <thead className="sticky top-0 bg-slate-100 z-50 shadow-sm">
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">No</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">
                            <div className="flex items-center justify-center">
                                <span>Nama</span>
                                <button onClick={onSortToggle} className="ml-2 cursor-pointer">
                                    {sortOrder === "asc" ? <FaArrowDownShortWide /> : <FaArrowUpShortWide />}
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">NIS</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">NISN</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Kelas</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Rombel</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Ekskul</th>
                    </tr>
                </thead>
                <tbody>
                    {siswaData.map((siswa, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} text-gray-700`}>
                            {/* Hitung nomor urut berdasarkan sortOrder */}
                            <td className="px-4 py-2 border-b border-gray-300 text-center">
                                {sortOrder === "asc"
                                    ? offset + index + 1 // Ascending: 1, 2, 3, ...
                                    : totalData - (offset + index) // Descending: 10.000, 9.999, 9.998, ...
                                }
                            </td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{siswa.nama_siswa}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{siswa.nis}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{siswa.nisn}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{siswa.nama_kelas}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">{siswa.nama_rombel}</td>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">
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