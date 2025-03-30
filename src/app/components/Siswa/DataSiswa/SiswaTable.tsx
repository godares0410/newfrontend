// components/Siswa/DataSiswa/SiswaTable.tsx
import React from 'react';
import { FaArrowDownShortWide, FaArrowUpShortWide, FaSort } from "react-icons/fa6";

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

type SortConfig = {
    key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas';
    order: 'asc' | 'desc';
};

type SiswaTableProps = {
    siswaData: Siswa[];
    sortConfig: SortConfig;
    onSort: (key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas') => void;
    totalData: number;
    currentPage: number;
    itemsPerPage: number;
};

const SiswaTable: React.FC<SiswaTableProps> = ({
    siswaData,
    sortConfig,
    onSort,
    totalData,
    currentPage,
    itemsPerPage,
}) => {
    const offset = (currentPage - 1) * itemsPerPage;

    const getNumbering = (index: number) => {
        if (sortConfig.order === "asc") {
            return offset + index + 1;
        } else {
            return totalData - offset - index;
        }
    };

    const renderSortIcon = (key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas') => {
        if (sortConfig.key === key) {
            return sortConfig.order === "asc" ? 
                <FaArrowDownShortWide className="text-blue-500 cursor-pointer" /> : 
                <FaArrowUpShortWide className="text-blue-500 cursor-pointer" />;
        }
        return <FaSort className="text-gray-400 cursor-pointer" />;
    };

    return (
        <div className="w-full max-h-full overflow-y-auto overflow-x-auto border-gray-300 rounded-md">
            <table className="min-w-full bg-white border-collapse">
                <thead className="sticky top-0 bg-slate-100 z-50 shadow-sm">
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">
                            <div className="flex items-center justify-center">
                                <span>No</span>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">
                            <div className="flex items-center justify-center">
                                <span>Nama</span>
                                <button 
                                    onClick={() => onSort('nama_siswa')} 
                                    className="ml-2 flex items-center"
                                >
                                    {renderSortIcon('nama_siswa')}
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">
                            <div className="flex items-center justify-center">
                                <span>NIS</span>
                                <button 
                                    onClick={() => onSort('nis')} 
                                    className="ml-2 flex items-center"
                                >
                                    {renderSortIcon('nis')}
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">
                            <div className="flex items-center justify-center">
                                <span>NISN</span>
                                <button 
                                    onClick={() => onSort('nisn')} 
                                    className="ml-2 flex items-center"
                                >
                                    {renderSortIcon('nisn')}
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">
                            <div className="flex items-center justify-center">
                                <span>Kelas</span>
                                <button 
                                    onClick={() => onSort('nama_kelas')} 
                                    className="ml-2 flex items-center"
                                >
                                    {renderSortIcon('nama_kelas')}
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Rombel</th>
                        <th className="px-4 py-2 border-b border-gray-300 text-center">Ekskul</th>
                    </tr>
                </thead>
                <tbody>
                    {siswaData.map((siswa, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} text-gray-700`}>
                            <td className="px-4 py-2 border-b border-gray-300 text-center">
                                {getNumbering(index)}
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