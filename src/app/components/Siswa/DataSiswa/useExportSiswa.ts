import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx-js-style'; // Gunakan xlsx-js-style untuk styling
import { saveAs } from 'file-saver';
import axios from 'axios';
import type { Siswa } from '@/app/components/types/siswa';

const useExportSiswa = (
  selectedRows: Set<number>,
  isAllDataSelected: boolean,
  siswaData: any[]
) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllSiswaData = async () => {
    try {
      const response = await axios.get('/api/siswa/all');
      return response.data.data_siswa || [];
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  };

  const handleExport = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let dataToExport: Siswa[] = [];

      if (isAllDataSelected) {
        dataToExport = await fetchAllSiswaData();
      } else {
        dataToExport = siswaData.filter((siswa: Siswa) => 
          selectedRows.has(siswa.id_siswa)
        );
      }

      if (dataToExport.length === 0) {
        alert('Tidak ada data yang dipilih untuk diekspor');
        return;
      }

      // Format data untuk Excel dengan styling
      const excelDataStyled = dataToExport.map((siswa: Siswa, index: number) => ({
        'No': {
          v: index + 1,
          s: {
            alignment: { horizontal: 'center' }
          }
        },
        'Nama Siswa': siswa.nama_siswa,
        'NIS': siswa.nis,
        'NISN': siswa.nisn,
        'Kelas': {
            v: siswa.nama_kelas || '-',
            s: {
              alignment: { horizontal: 'center' }
            }
          },
        'Rombel': siswa.nama_rombel || '-',
        'Ekstrakurikuler': siswa.ekskul?.map(e => e.nama).join(', ') || '-',
        'Jenis Kelamin': {
            v: siswa.jenis_kelamin || '-',
            s: {
              alignment: { horizontal: 'center' }
            }
          },
        'Tahun Masuk': {
            v: siswa.tahun_masuk || '-',
            s: {
              alignment: { horizontal: 'center' }
            }
          },
        'Status':{
            v: Number(siswa.status) === 1 ? 'Aktif' : 'Non-Aktif',
            s: {
              alignment: { horizontal: 'center' }
            }
          },
      }));

      // Buat worksheet dari data
      const worksheet = XLSX.utils.json_to_sheet(excelDataStyled);

      // Atur lebar kolom
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

      // Styling untuk header
      const headerStyle = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true },
        fill: {
          fgColor: { rgb: 'D9E1F2' }
        },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        }
      };

      // Ambil semua kolom header dari objek pertama
      const headerKeys = Object.keys(excelDataStyled[0]);

      // Terapkan style ke semua header cell
      headerKeys.forEach((key, colIdx) => {
        const cellRef = XLSX.utils.encode_cell({ c: colIdx, r: 0 });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = headerStyle;
        }
      });

      // Buat workbook dan append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

      // Generate Excel buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Download file
      saveAs(blob, `data_siswa_${new Date().toISOString().slice(0,10)}.xlsx`);

    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengekspor data: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRows, isAllDataSelected, siswaData]);

  return {
    handleExport,
    isLoading,
  };
};

export default useExportSiswa;
