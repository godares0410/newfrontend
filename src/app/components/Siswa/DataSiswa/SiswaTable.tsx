// components/Siswa/DataSiswa/SiswaTable.tsx
import React, { useState, useEffect } from 'react';
import { FaArrowDownShortWide, FaArrowUpShortWide, FaSort, FaArrowRightLong, FaPencil } from "react-icons/fa6";
import { MdArchive } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import type { SiswaTableProps } from "@/app/components/types/siswa";

const SiswaTable: React.FC<SiswaTableProps> = ({
    siswaData,
    sortConfig,
    onSort,
    totalData,
    currentPage,
    itemsPerPage,
}) => {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const allVisibleIds = new Set(siswaData.map(siswa => siswa.id_siswa));
        const allVisibleSelected = Array.from(selectedRows).every(id => allVisibleIds.has(id));
        
        if (allVisibleIds.size > 0 && selectedRows.size > 0) {
            const isAllVisibleSelected = Array.from(allVisibleIds).every(id => selectedRows.has(id));
            setSelectAll(isAllVisibleSelected);
        } else {
            setSelectAll(false);
        }
    }, [selectedRows, siswaData]);

    const getNumbering = (index: number) => {
        if (sortConfig.order === "asc") {
            return (currentPage - 1) * itemsPerPage + index + 1;
        } else {
            return totalData - (currentPage - 1) * itemsPerPage - index;
        }
    };

    const renderSortIcon = (key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas' | 'nama_rombel') => {
        if (sortConfig.key === key) {
            return sortConfig.order === "asc" ?
                <FaArrowDownShortWide className="text-blue-500 cursor-pointer" /> :
                <FaArrowUpShortWide className="text-blue-500 cursor-pointer" />;
        }
        return <FaSort className="text-gray-400 cursor-pointer" />;
    };

    const handleRowSelect = (id: number) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(id)) {
            newSelectedRows.delete(id);
        } else {
            newSelectedRows.add(id);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleSelectAllVisible = () => {
        const allVisibleIds = new Set(siswaData.map(siswa => siswa.id_siswa));
        
        if (selectAll) {
            // Deselect all visible
            const newSelectedRows = new Set(selectedRows);
            allVisibleIds.forEach(id => newSelectedRows.delete(id));
            setSelectedRows(newSelectedRows);
        } else {
            // Select all visible
            const newSelectedRows = new Set(selectedRows);
            allVisibleIds.forEach(id => newSelectedRows.add(id));
            setSelectedRows(newSelectedRows);
        }
    };

    const handleSelectAllData = () => {
        const allVisibleIds = siswaData.map(siswa => siswa.id_siswa);
        const newSelectedRows = new Set(selectedRows);
        
        allVisibleIds.forEach(id => newSelectedRows.add(id));
        setSelectedRows(newSelectedRows);
    };

    const handleClearSelection = () => {
        setSelectedRows(new Set());
    };

    const handleExport = () => {
        console.log("Exporting selected data:", Array.from(selectedRows));
    };

    const handleEdit = () => {
        console.log("Editing selected data:", Array.from(selectedRows));
    };

    const handleArchive = () => {
        console.log("Archiving selected data:", Array.from(selectedRows));
    };

    return (
        <div className='w-full max-h-full overflow-auto'>
            {/* Action Bar - Only visible when there are selected rows */}
            {selectedRows.size > 0 && (
                <div className="h-10 sticky top-0 z-50 bg-cyan-100 flex items-center p-2">
                    <div className="flex gap-2">
                        <div className="p-1 bg-emerald-300 rounded-lg flex gap-1 items-center">
                            <div className="text-sm flex items-center text-slate-600">
                                {selectedRows.size} Terseleksi
                            </div>
                            <div 
                                className="text-sm flex items-center gap-1 bg-emerald-700 px-2 text-slate-100 rounded-2xl cursor-pointer"
                                onClick={handleSelectAllData}
                            >
                                <FaArrowRightLong /> Pilih Semua {totalData}
                            </div>
                            <IoIosClose 
                                className="text-xl font-bold text-slate-600 cursor-pointer" 
                                onClick={handleClearSelection}
                            />
                        </div>
                        <div 
                            className="text-slate-600 cursor-pointer text-sm p-1 bg-emerald-300 rounded-lg flex gap-1 items-center"
                            onClick={handleExport}
                        >
                            <RiFileExcel2Fill />Export
                        </div>
                        <div 
                            className="text-slate-600 cursor-pointer text-sm p-1 bg-cyan-300 rounded-lg flex gap-1 items-center"
                            onClick={handleEdit}
                        >
                            <FaPencil />Edit
                        </div>
                        <div 
                            className="text-slate-600 cursor-pointer text-sm p-1 bg-red-300 rounded-lg flex gap-1 items-center"
                            onClick={handleArchive}
                        >
                            <MdArchive />Arsipkan
                        </div>
                    </div>
                </div>
            )}
            {/* End Action Bar */}
            <div className="border-gray-300 border">
                <table className="min-w-full bg-white border-collapse">
                    <thead className={`sticky ${selectedRows.size > 0 ? 'top-10' : 'top-0'} bg-slate-100 z-40 shadow-sm`}>
                        <tr>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllVisible}
                                        className="mr-2"
                                    />
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
                            <th className="px-4 py-2 border-b border-gray-300 text-center">
                                <div className="flex items-center justify-center">
                                    <span>Rombel</span>
                                    <button
                                        onClick={() => onSort('nama_rombel')}
                                        className="ml-2 flex items-center"
                                    >
                                        {renderSortIcon('nama_rombel')}
                                    </button>
                                </div>
                            </th>
                            <th className="px-4 py-2 border-b border-gray-300 text-center">Ekskul</th>
                        </tr>
                    </thead>
                    <tbody>
                        {siswaData.map((siswa, index) => (
                            <tr 
                                key={siswa.id_siswa} 
                                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-gray-700`}
                            >
                                <td className="px-4 py-2 border-b border-gray-300 text-center">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(siswa.id_siswa)}
                                            onChange={() => handleRowSelect(siswa.id_siswa)}
                                            className="mr-2"
                                        />
                                        {getNumbering(index)}
                                    </div>
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
        </div>
    );
};

export default SiswaTable;