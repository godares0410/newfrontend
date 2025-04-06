import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';

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
      
      let dataToExport = [];
      
      if (isAllDataSelected) {
        dataToExport = await fetchAllSiswaData();
      } else {
        dataToExport = siswaData.filter(siswa => 
          selectedRows.has(siswa.id_siswa)
        );
      }

      if (dataToExport.length === 0) {
        alert('Tidak ada data yang dipilih untuk diekspor');
        return;
      }

      // Format data untuk Excel dengan kolom No++
      const excelData = dataToExport.map((siswa: { nama_siswa: any; nis: any; nisn: any; nama_kelas: any; nama_rombel: any; ekskul: any[]; jenis_kelamin: any; tahun_masuk: any; status: number; }, index: number) => ({
        'No': index + 1,
        'Nama Siswa': siswa.nama_siswa,
        'NIS': siswa.nis,
        'NISN': siswa.nisn,
        'Kelas': siswa.nama_kelas || '-',
        'Rombel': siswa.nama_rombel || '-',
        'Ekstrakurikuler': siswa.ekskul?.map(e => e.nama).join(', ') || '-',
        'Jenis Kelamin': siswa.jenis_kelamin,
        'Tahun Masuk': siswa.tahun_masuk || '-',
        'Status': siswa.status === 1 ? 'Aktif' : 'Non-Aktif',
      }));

      // Buat worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Atur lebar kolom (opsional)
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
      
      // Buat workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
      
      // Generate file Excel
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