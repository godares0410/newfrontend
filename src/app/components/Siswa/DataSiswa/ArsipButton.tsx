import React, { useState } from 'react';
import { MdArchive } from "react-icons/md";
import axios from 'axios';
import Swal from 'sweetalert2';

interface ArsipButtonProps {
  selectedRows: Set<number>;
  disabled?: boolean;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  statusFilter: boolean;
}

const ArsipButton: React.FC<ArsipButtonProps> = ({
  selectedRows,
  disabled = false,
  className = "",
  onSuccess,
  onError,
  statusFilter
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const message = statusFilter 
    ? `Apakah Anda yakin ingin mengarsipkan <span class="text-red-500 font-bold">${selectedRows.size}</span> data siswa?`
    : `Apakah Anda yakin ingin batal arsipkan <span class="text-red-500 font-bold">${selectedRows.size}</span> data siswa?`;
  const messagesukses = statusFilter 
    ? `<span class="text-red-500 font-bold">${selectedRows.size}</span> data siswa berhasil diarsipkan`
    : `<span class="text-emerald-500 font-bold">${selectedRows.size}</span> data siswa berhasil dipulihkan`;

  const handleArsip = async () => {
    if (selectedRows.size === 0) {
      onError?.('Tidak ada siswa yang dipilih');
      return;
    }

    // Konfirmasi dengan SweetAlert2
    const result = await Swal.fire({
      title: 'Arsipkan Data',
      html: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Arsipkan!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    
    try {
        const ids = Array.from(selectedRows);
        
        // Kirim data dalam body
        await axios.put(`/api/siswa/status/${statusFilter ? 1 : 0}`, { ids });
      
      // Notifikasi sukses
      await Swal.fire({
        title: 'Berhasil!',
        html: messagesukses,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Error archiving students:', error);
      
      // Notifikasi error
      await Swal.fire({
        title: 'Gagal!',
        text: error instanceof Error ? error.message : 'Gagal mengarsipkan siswa',
        icon: 'error'
      });
      
      onError?.(error instanceof Error ? error.message : 'Gagal mengarsipkan siswa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
    onClick={handleArsip}
    disabled={disabled || isLoading}
    className={`text-slate-600 hover:bg-red-400 cursor-pointer text-sm p-1 bg-red-300 rounded-lg flex gap-1 items-center transition-colors disabled:opacity-50 ${className}`}
  >
    {isLoading ? (
      statusFilter ? 'Mengarsipkan...' : 'Batal arsipkan...'
    ) : (
      <>
        <MdArchive /> {statusFilter ? `Arsipkan (${selectedRows.size})` : `Batal Arsipkan (${selectedRows.size})`}
      </>
    )}
  </button>
  );
};

export default ArsipButton;