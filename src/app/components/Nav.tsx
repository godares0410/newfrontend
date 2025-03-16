"use client";

import { IoMdSearch } from "react-icons/io";
import { FaAngleLeft, FaAngleRight, FaThList } from "react-icons/fa";
import { TbLayoutKanbanFilled } from "react-icons/tb";

interface NavProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    viewMode: "kanban" | "list"; // Tambahkan viewMode
    setViewMode: (mode: "kanban" | "list") => void; // Tambahkan setViewMode
}

export default function Nav({ searchQuery, setSearchQuery, currentPage, totalPages, setCurrentPage, viewMode, setViewMode }: NavProps) {
    return (
        <div className="w-full items-center justify-between h-16 px-8 grid grid-cols-3 gap-4">
            <div className="gap-2 flex items-center">
                <div className="text-sm py-2 flex justify-center items-center bg-emerald-600 text-white px-3 rounded-lg hover:bg-emerald-700 cursor-pointer">
                    Tambah
                </div>
                <div className="text-2xl text-slate-700">Siswa</div>
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
            <div className=" flex justify-center items-center h-full gap-4">
                <div className="flex items-center">
                    <span className="text-slate-700 text-sm">{`${currentPage} dari ${totalPages}`}</span>
                    <button
                        className="text-slate-700 text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-default"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaAngleLeft />
                    </button>
                    <button
                        className="text-slate-700 text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-default"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FaAngleRight />
                    </button>
                </div>
                <div className="flex gap-0.5">
                    <div
                        className={`h-8 w-8 ${viewMode === "kanban" ? "bg-amber-300" : "bg-gray-300"} rounded-md p-1 cursor-pointer`}
                        onClick={() => setViewMode("kanban")}
                    >
                        <TbLayoutKanbanFilled className="w-full h-full" />
                    </div>
                    <div
                        className={`h-8 w-8 ${viewMode === "list" ? "bg-amber-300" : "bg-gray-300"} rounded-md p-1 cursor-pointer`}
                        onClick={() => setViewMode("list")}
                    >
                        <FaThList className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}