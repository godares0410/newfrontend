// /Users/admin/Documents/newfrontend/src/app/components/Siswa/DataSiswa/SiswaTable.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  FaArrowDownShortWide,
  FaArrowUpShortWide,
  FaSort,
  FaArrowRightLong,
  FaPencil
} from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import type { SiswaTableProps } from "@/app/components/types/siswa";
import ExportButton from "@/app/components/Siswa/DataSiswa/ExportButton";
import ArsipButton from "@/app/components/Siswa/DataSiswa/ArsipButton";
import HapusButton from "@/app/components/Siswa/DataSiswa/DeleteButton";
import EditMassalModal from "@/app/components/Siswa/DataSiswa/EditMassalModal";

const SiswaTable: React.FC<SiswaTableProps> = ({
  siswaData,
  sortConfig,
  onSort,
  totalData,
  currentPage,
  itemsPerPage,
  statusFilter,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [allIds, setAllIds] = useState<number[]>([]);
  const [isLoadingAllIds, setIsLoadingAllIds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleArsipSuccess = useCallback(() => {
    setNotification({ type: 'success', message: 'Siswa berhasil diarsipkan' });
    setSelectedRows(new Set()); // Clear selection after archiving
  }, []);

  const handleArsipError = useCallback((error: string) => {
    setNotification({ type: 'error', message: error });
  }, []);

  const fetchAllStudentIds = useCallback(async () => {
    setIsLoadingAllIds(true);
    setError(null);
    try {
      const response = await axios.get<{ data: number[] }>(`/api/idsiswa/${statusFilter ? 1 : 0}`, {
        timeout: 10000,
      });
      setAllIds(response.data.data);
    } catch (err) {
      setError('Gagal memuat data ID siswa');
      console.error('Error fetching student IDs:', err);
    } finally {
      setIsLoadingAllIds(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAllStudentIds();
  }, [fetchAllStudentIds]);

  // Reset selectedRows when statusFilter changes
  useEffect(() => {
    setSelectedRows(new Set());
  }, [statusFilter]);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedRows.size > 0 &&
        selectedRows.size < siswaData.length &&
        !isAllDataSelected();
    }
  }, [selectedRows, siswaData]);

  const getSortedData = useCallback(() => {
    if (!sortConfig.key) return siswaData;

    return [...siswaData].sort((a, b) => {
      // Special case for nama_kelas + nama_siswa
      if (sortConfig.key === 'nama_kelas') {
        const kelasCompare = (a.nama_kelas || '').localeCompare(b.nama_kelas || '');
        if (kelasCompare !== 0) {
          return sortConfig.order === 'asc' ? kelasCompare : -kelasCompare;
        }
        return (a.nama_siswa || '').localeCompare(b.nama_siswa || '');
      }

      // Special case for nama_rombel + nama_siswa
      if (sortConfig.key === 'nama_rombel') {
        const rombelCompare = (a.nama_rombel || '').localeCompare(b.nama_rombel || '');
        if (rombelCompare !== 0) {
          return sortConfig.order === 'asc' ? rombelCompare : -rombelCompare;
        }
        return (a.nama_siswa || '').localeCompare(b.nama_siswa || '');
      }

      // Default sorting for other columns
      const aValue = a[sortConfig.key as keyof typeof a] || '';
      const bValue = b[sortConfig.key as keyof typeof b] || '';

      if (aValue < bValue) {
        return sortConfig.order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [siswaData, sortConfig]);

  const sortedData = getSortedData();

  const getNumbering = useCallback((index: number) => {
    return sortConfig.order === "asc"
      ? (currentPage - 1) * itemsPerPage + index + 1
      : totalData - (currentPage - 1) * itemsPerPage - index;
  }, [currentPage, itemsPerPage, sortConfig.order, totalData]);

  const renderSortIcon = useCallback((key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.order === "asc"
        ? <FaArrowDownShortWide className="text-blue-500 cursor-pointer" />
        : <FaArrowUpShortWide className="text-blue-500 cursor-pointer" />;
    }
    return <FaSort className="text-gray-400 cursor-pointer" />;
  }, [sortConfig]);

  const isAllVisibleSelected = useCallback(() => {
    return sortedData.every(siswa => selectedRows.has(siswa.id_siswa));
  }, [sortedData, selectedRows]);

  const isSomeVisibleSelected = useCallback(() => {
    return sortedData.some(siswa => selectedRows.has(siswa.id_siswa)) &&
      !isAllVisibleSelected();
  }, [sortedData, selectedRows, isAllVisibleSelected]);

  const isAllDataSelected = useCallback(() => {
    return allIds.length > 0 && selectedRows.size === allIds.length;
  }, [allIds, selectedRows]);

  const handleRowSelect = useCallback((id: number) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
      return newSelected;
    });
  }, []);

  const handleSelectVisible = useCallback(() => {
    const visibleIds = sortedData.map(s => s.id_siswa);

    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      const allSelected = isAllVisibleSelected();

      visibleIds.forEach(id => {
        allSelected ? newSelected.delete(id) : newSelected.add(id);
      });

      return newSelected;
    });
  }, [sortedData, isAllVisibleSelected]);

  const handleSelectAllData = useCallback(async () => {
    if (isAllDataSelected()) {
      setSelectedRows(new Set());
    } else {
      if (allIds.length === 0) {
        await fetchAllStudentIds();
      }
      setSelectedRows(new Set(allIds));
    }
  }, [allIds, isAllDataSelected, fetchAllStudentIds]);

  const handleClearSelection = useCallback(() => setSelectedRows(new Set()), []);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
        <button
          onClick={fetchAllStudentIds}
          className="ml-2 px-2 py-1 bg-gray-200 rounded"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-h-full overflow-auto mt-2">
      {selectedRows.size > 0 && (
        <div className="h-10 sticky top-0 z-40 bg-cyan-100 flex items-center p-2">
          <div className="flex gap-2">
            <div className="p-1 bg-emerald-300 rounded-lg flex gap-1 items-center">
              <span className="text-sm text-slate-600">
                {selectedRows.size} Terseleksi
              </span>
              {!isAllDataSelected() && (
                <button
                  onClick={handleSelectAllData}
                  disabled={isLoadingAllIds}
                  className="text-sm flex cursor-pointer items-center gap-1 px-2 bg-emerald-700 text-slate-100 rounded-2xl disabled:opacity-50 hover:bg-emerald-800"
                >
                  {isLoadingAllIds ? (
                    'Memuat...'
                  ) : (
                    <>
                      <FaArrowRightLong /> Pilih Semua {allIds.length}
                    </>
                  )}
                </button>
              )}
              <IoIosClose
                className="text-xl font-bold text-slate-600 cursor-pointer hover:text-red-500"
                onClick={handleClearSelection}
              />
            </div>

            <ExportButton
              selectedRows={selectedRows}
              isAllDataSelected={isAllDataSelected()}
              siswaData={sortedData}
              sortConfig={sortConfig}
              disabled={isLoadingAllIds}
              statusFilter={statusFilter}
            />

            {statusFilter && (
              <button className="text-slate-600 hover:bg-cyan-400 cursor-pointer text-sm p-1 bg-cyan-300 rounded-lg flex gap-1 items-center transition-colors">
                <FaPencil /> Edit Massal
              </button>
            )}
            <ArsipButton
              selectedRows={selectedRows}
              disabled={isLoadingAllIds}
              onSuccess={handleArsipSuccess}
              onError={handleArsipError}
              statusFilter={statusFilter}
            />
            {!statusFilter && (
              <HapusButton
                selectedRows={selectedRows}
                disabled={isLoadingAllIds}
                onSuccess={handleArsipSuccess} // Anda bisa buat handler khusus untuk hapus jika perlu
                onError={handleArsipError}
              />
            )}

          </div>
        </div>
      )}

      <div className="border-gray-300">
        <table className="min-w-full bg-white divide-y divide-gray-300">
          <thead className={`bg-slate-100 sticky ${selectedRows.size > 0 ? 'top-10' : 'top-0'} z-40`}>
            <tr>
              <th className="px-4 py-3 text-center w-16 sticky left-0 bg-slate-100 z-20">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    ref={checkboxRef}
                    checked={isAllVisibleSelected()}
                    onChange={handleSelectVisible}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2 cursor-pointer"
                  />
                  <span className="text-sm font-medium">No</span>
                </div>
              </th>

              <th className="px-4 py-3 text-left sticky left-16 bg-slate-100 z-20">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium">Nama Siswa</span>
                  <button
                    onClick={() => onSort('nama_siswa')}
                    className="ml-2 focus:outline-none"
                  >
                    {renderSortIcon('nama_siswa')}
                  </button>
                </div>
              </th>

              <th className="px-4 py-3 text-left">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium">NIS</span>
                  <button
                    onClick={() => onSort('nis')}
                    className="ml-2 focus:outline-none"
                  >
                    {renderSortIcon('nis')}
                  </button>
                </div>
              </th>

              <th className="px-4 py-3 text-left">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium">NISN</span>
                  <button
                    onClick={() => onSort('nisn')}
                    className="ml-2 focus:outline-none"
                  >
                    {renderSortIcon('nisn')}
                  </button>
                </div>
              </th>

              <th className="px-4 py-3 text-left">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium">Kelas</span>
                  <button
                    onClick={() => onSort('nama_kelas')}
                    className="ml-2 focus:outline-none"
                  >
                    {renderSortIcon('nama_kelas')}
                  </button>
                </div>
              </th>

              <th className="px-4 py-3 text-left">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium">Rombel</span>
                  <button
                    onClick={() => onSort('nama_rombel')}
                    className="ml-2 focus:outline-none"
                  >
                    {renderSortIcon('nama_rombel')}
                  </button>
                </div>
              </th>

              <th className="px-4 py-3 text-center">
                <span className="text-sm font-medium">Ekstrakurikuler</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sortedData.map((siswa, index) => (
              <tr
                key={siswa.id_siswa}
                className={`${selectedRows.has(siswa.id_siswa)
                  ? 'bg-blue-50'
                  : index % 2 === 0
                    ? 'bg-white'
                    : 'bg-gray-100'
                  } hover:bg-blue-100 transition-colors`}
              >
                <td className="px-4 py-3 text-center sticky left-0 bg-inherit z-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(siswa.id_siswa)}
                      onChange={() => handleRowSelect(siswa.id_siswa)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700 w-6">
                      {getNumbering(index)}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 sticky left-16 bg-inherit z-10">
                  <div className="flex items-center">
                    {siswa.foto && (
                      <img
                        src={`/img/siswa/sabilillah/${siswa.foto}`}
                        alt={siswa.nama_siswa}
                        className="h-8 w-8 rounded-full object-cover mr-3"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {siswa.nama_siswa}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-gray-700 text-center">{siswa.nis}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{siswa.nisn}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{siswa.nama_kelas}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{siswa.nama_rombel}</td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {siswa.ekskul.map((e, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ backgroundColor: `${e.warna}20`, color: e.warna }}
                      >
                        {e.nama}
                      </span>
                    ))}
                  </div>
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