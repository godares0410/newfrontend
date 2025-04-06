import React from 'react';
import { RiFileExcel2Fill } from "react-icons/ri";
import useExportSiswa from './useExportSiswa';

interface ExportButtonProps {
  selectedRows: Set<number>;
  isAllDataSelected: boolean;
  siswaData: any[];
  sortConfig: {
    key: string;
    order: 'asc' | 'desc';
  };
  disabled?: boolean;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  selectedRows,
  isAllDataSelected,
  siswaData,
  sortConfig,
  disabled = false,
  className = "",
}) => {
  const { handleExport, isLoading } = useExportSiswa(
    selectedRows,
    isAllDataSelected,
    siswaData,
    sortConfig
  );

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isLoading}
      className={`text-slate-600 hover:bg-emerald-400 cursor-pointer text-sm p-1 bg-emerald-300 rounded-lg flex gap-1 items-center transition-colors disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        'Mengekspor...'
      ) : (
        <>
          <RiFileExcel2Fill /> Export
        </>
      )}
    </button>
  );
};

export default ExportButton;