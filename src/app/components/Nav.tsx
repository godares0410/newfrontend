"use client";

import { IoMdSearch } from "react-icons/io";
import { FaCheck, FaChevronDown, FaAngleLeft, FaAngleRight, FaList } from "react-icons/fa";
import { MdArchive } from "react-icons/md";
import { TbLayoutKanbanFilled } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";

interface StatusDropdownProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const StatusDropdown = ({ value, onChange }: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (selectedValue: boolean) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
          value ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-slate-800'
        } min-w-[120px] hover:opacity-90`}
      >
        <div className="flex items-center gap-2">
          {value ? (
            <FaCheck className="text-emerald-600" />
          ) : (
            <MdArchive className="text-slate-600" />
          )}
          {value ? "Aktif" : "Arsip"}
        </div>
        <FaChevronDown className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <button
            onClick={() => handleSelect(true)}
            className={`flex cursor-pointer items-center w-full px-4 py-2 text-sm ${
              value 
                ? 'bg-emerald-50 text-emerald-800 font-medium' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <FaCheck className={`mr-2 ${value ? "opacity-100" : "opacity-0"}`} />
            Aktif
          </button>
          <button
            onClick={() => handleSelect(false)}
            className={`flex cursor-pointer items-center w-full px-4 py-2 text-sm ${
              !value 
                ? 'bg-amber-50 text-amber-800 font-medium' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <MdArchive className={`mr-2 ${!value ? "opacity-100" : "opacity-0"}`} />
            Arsip
          </button>
        </div>
      )}
    </div>
  );
};

interface NavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  viewMode: "kanban" | "list";
  setViewMode: (mode: "kanban" | "list") => void;
  statusFilter: boolean;
  setStatusFilter: (status: boolean) => void;
}

export default function Nav({
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  setCurrentPage,
  viewMode,
  setViewMode,
  statusFilter,
  setStatusFilter
}: NavProps) {
  return (
    <div className="w-full items-center justify-between h-16 px-8 grid grid-cols-3 gap-4">
      <div className="gap-2 flex items-center">
        <div className="text-2xl text-slate-700 flex items-center gap-2">
          Data Siswa
        </div>
        <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="gap-2 px-4 h-10 bg-slate-100 rounded-xl flex items-center justify-between">
        <input
          type="text"
          placeholder="Cari..."
          className="bg-transparent text-lg text-slate-700 placeholder-slate-500 outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IoMdSearch className="text-xl text-slate-700" />
      </div>

      <div className="flex px-1 justify-end items-center h-full gap-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-700 text-sm">{`${currentPage} dari ${totalPages}`}</span>
          <div className="flex">
            <button
              type="button"
              className="text-slate-700 text-xl cursor-pointer disabled:opacity-50 disabled:cursor-default p-1"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaAngleLeft />
            </button>
            <button
              type="button"
              className="text-slate-700 text-xl cursor-pointer disabled:opacity-50 disabled:cursor-default p-1"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={`h-8 w-8 flex items-center justify-center ${viewMode === "kanban" ? "bg-amber-300" : "bg-gray-300"} rounded-md p-1 cursor-pointer transition-colors`}
            onClick={() => setViewMode("kanban")}
            title="Tampilan Kanban"
          >
            <TbLayoutKanbanFilled className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`h-8 w-8 flex items-center justify-center ${viewMode === "list" ? "bg-amber-300" : "bg-gray-300"} rounded-md p-1 cursor-pointer transition-colors`}
            onClick={() => setViewMode("list")}
            title="Tampilan List"
          >
            <FaList className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm bg-emerald-400 rounded-md px-2 py-1 cursor-pointer shadow-md hover:bg-emerald-500 text-slate-700 hover:text-slate-100">Tambah Data</div>
      </div>
    </div>
  );
}