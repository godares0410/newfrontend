// /Users/admin/Documents/newfrontend/src/app/components/Siswa/DataSiswa/HapusButton.tsx
import React, { useState } from 'react';
import { FaTrash } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HapusButtonProps {
  selectedRows: Set<number>;
  disabled?: boolean;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const HapusButton: React.FC<HapusButtonProps> = ({
  selectedRows,
  disabled = false,
  className = "",
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleHapus = async () => {
    if (selectedRows.size === 0) {
      onError?.('Tidak ada siswa yang dipilih');
      toast.error('Tidak ada siswa yang dipilih');
      return;
    }

    // Konfirmasi dengan SweetAlert2
    const result = await Swal.fire({
      title: 'Hapus Data',
      html: `Apakah Anda yakin ingin <span class="text-red-500 font-bold">menghapus permanen</span> <span class="text-red-500 font-bold">${selectedRows.size}</span> data siswa? <br/><br/><span class="text-sm text-red-500">Aksi ini tidak dapat dibatalkan!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    
    try {
      const ids = Array.from(selectedRows);
      
      // Kirim permintaan DELETE
      await axios.delete('/api/siswa', { data: { ids } });
      
      // Notifikasi sukses
      toast.success(
        <div dangerouslySetInnerHTML={{ __html: `<span class="text-red-500 font-bold">${selectedRows.size}</span> data siswa berhasil dihapus permanen` }} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      
      onSuccess?.();
    } catch (error) {
      console.error('Error deleting students:', error);
      
      // Notifikasi error
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus siswa';
      toast.error(errorMessage);
      
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleHapus}
      disabled={disabled || isLoading}
      className={`text-white hover:bg-red-600 cursor-pointer text-sm p-1 bg-red-500 rounded-lg flex gap-1 items-center transition-colors disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        'Menghapus...'
      ) : (
        <>
          <FaTrash /> Hapus ({selectedRows.size})
        </>
      )}
    </button>
  );
};

export default HapusButton;