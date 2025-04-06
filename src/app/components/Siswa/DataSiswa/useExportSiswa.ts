import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import axios from 'axios';
import type { Siswa } from '@/app/components/types/siswa';

type SortConfig = {
  key: string;
  order: 'asc' | 'desc';
};

type ExcelStyledCell = {
  v: string | number;
  s: XLSX.CellStyle;
};

type ExcelRowData = {
  [key: string]: string | number | ExcelStyledCell;
};

const useExportSiswa = (
  selectedRows: Set<number>,
  isAllDataSelected: boolean,
  siswaData: Siswa[],
  sortConfig: SortConfig
) => {
  const [isLoading, setIsLoading] = useState(false);

  // Reusable styles
  const centerStyle: XLSX.CellStyle = {
    alignment: { horizontal: 'center' }
  };

  const headerStyle: XLSX.CellStyle = {
    alignment: { horizontal: 'center', vertical: 'center' },
    font: { bold: true },
    fill: { fgColor: { rgb: 'D9E1F2' } },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    }
  };

  const fetchAllSiswaData = async (): Promise<Siswa[]> => {
    try {
      const response = await axios.get('/api/siswa/all');
      return response.data.data_siswa || [];
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  };

  const sortData = (data: Siswa[]): Siswa[] => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      // Special case for nama_kelas + nama_siswa
      if (sortConfig.key === 'nama_kelas') {
        const kelasCompare = (a.nama_kelas || '').localeCompare(b.nama_kelas || '');
        if (kelasCompare !== 0) {
          return sortConfig.order === 'asc' ? kelasCompare : -kelasCompare;
        }
        // If kelas sama, sort by nama_siswa ascending
        return (a.nama_siswa || '').localeCompare(b.nama_siswa || '');
      }

      // Special case for nama_rombel + nama_siswa
      if (sortConfig.key === 'nama_rombel') {
        const rombelCompare = (a.nama_rombel || '').localeCompare(b.nama_rombel || '');
        if (rombelCompare !== 0) {
          return sortConfig.order === 'asc' ? rombelCompare : -rombelCompare;
        }
        // If rombel sama, sort by nama_siswa ascending
        return (a.nama_siswa || '').localeCompare(b.nama_siswa || '');
      }

      // Default sorting for other columns
      const aValue = a[sortConfig.key as keyof Siswa] || '';
      const bValue = b[sortConfig.key as keyof Siswa] || '';

      if (aValue < bValue) {
        return sortConfig.order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleExport = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let dataToExport: Siswa[] = isAllDataSelected 
        ? await fetchAllSiswaData() 
        : siswaData.filter(siswa => selectedRows.has(siswa.id_siswa));

      if (dataToExport.length === 0) {
        alert('Tidak ada data yang dipilih untuk diekspor');
        return;
      }

      // Apply sorting before export
      dataToExport = sortData(dataToExport);

      // Format data dengan styling
      const excelDataStyled: ExcelRowData[] = dataToExport.map((siswa, index) => ({
        'No': { v: index + 1, s: centerStyle },
        'Nama Siswa': siswa.nama_siswa,
        'NIS': siswa.nis,
        'NISN': siswa.nisn,
        'Kelas': { v: siswa.nama_kelas || '-', s: centerStyle },
        'Rombel': siswa.nama_rombel || '-',
        'Ekstrakurikuler': siswa.ekskul?.map(e => e.nama).join(', ') || '-',
        'Jenis Kelamin': { v: siswa.jenis_kelamin || '-', s: centerStyle },
        'Tahun Masuk': { v: siswa.tahun_masuk || '-', s: centerStyle },
        'Status': { 
          v: Number(siswa.status) === 1 ? 'Aktif' : 'Non-Aktif', 
          s: centerStyle 
        },
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelDataStyled);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 5 },   // No
        { wch: 25 },  // Nama Siswa
        { wch: 15 },  // NIS
        { wch: 15 },  // NISN
        { wch: 10 },  // Kelas
        { wch: 10 },  // Rombel
        { wch: 30 },  // Ekstrakurikuler
        { wch: 15 },  // Jenis Kelamin
        { wch: 12 },  // Tahun Masuk
        { wch: 10 }   // Status
      ];

      // Apply header style
      const headerKeys = Object.keys(excelDataStyled[0]);
      headerKeys.forEach((_, colIdx) => {
        const cellRef = XLSX.utils.encode_cell({ c: colIdx, r: 0 });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = headerStyle;
        }
      });

      // Create and export workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAs(
        new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        }),
        `data_siswa_${new Date().toISOString().slice(0,10)}.xlsx`
      );

    } catch (error) {
      console.error('Export error:', error);
      alert(`Gagal mengekspor data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRows, isAllDataSelected, siswaData, sortConfig]);

  return {
    handleExport,
    isLoading,
  };
};

export default useExportSiswa;