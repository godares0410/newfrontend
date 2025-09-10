// /Users/admin/Documents/newfrontend/src/app/siswa/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useSWR from 'swr';
import Header from "@/app/components/Header";
import Nav from "@/app/components/Nav";
import SiswaCard from "@/app/components/Siswa/DataSiswa/SiswaCard";
import SiswaTable from "@/app/components/Siswa/DataSiswa/SiswaTable";
import Sidebar from "@/app/components/Siswa/DataSiswa/SiswaSidebar";
import type { Siswa, Ekskul, SortConfig } from "@/app/components/types/siswa";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Siswa() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'nama_siswa',
        order: 'asc'
    });
    const [statusFilter, setStatusFilter] = useState(true);
    const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
    const itemsPerPage = 100;

    const menuData = {
        icon: "/img/aplikasi/Siswa.svg",
        label: "Siswa",
        menuItems: [
            { label: "Data Siswa", link: "/siswa/daftar-siswa" },
            { label: "Buku Induk", link: "/siswa/buku-induk" },
            { label: "Catatan", link: "/siswa/catatan" },
            { label: "Laporan", link: "/siswa/laporan" },
        ],
    };

    const { data, error, isLoading } = useSWR(
        `/api/siswa/${statusFilter ? 1 : 0}?page=${currentPage}&search=${encodeURIComponent(searchQuery)}&sort=${sortConfig.key}&order=${sortConfig.order}`,
        fetcher,
        { revalidateOnFocus: false }
    );

    const siswaData = useMemo(() => data?.data_siswa || [], [data]);
    const total = useMemo(() => data?.total || 0, [data]);
    const totalPages = Math.ceil(total / itemsPerPage);

    const warnaEkskul = useMemo(() => {
        const ekskulList = siswaData.flatMap((siswa: Siswa) =>
            siswa.ekskul.map((e: any) => ({ nama: e.nama, warna: e.warna }))
        );
        const uniqueWarnaEkskul = Array.from(new Set(ekskulList.map((e: any) => e.nama)))
            .map((nama: any) => ekskulList.find((e: any) => e.nama === nama))
            .filter((e): e is Ekskul => e !== undefined);
        return uniqueWarnaEkskul;
    }, [siswaData]);

    const handleSort = (key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas' | 'nama_rombel') => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return {
                    key,
                    order: prev.order === 'asc' ? 'desc' : 'asc'
                };
            }
            return {
                key,
                order: 'asc'
            };
        });
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) {
        return (
            <main className="h-screen flex flex-col items-center bg-cyan-100 overflow-auto">
                <Header menuData={menuData} />
                <div className="flex-1 flex justify-center items-center">
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="h-screen flex flex-col items-center bg-cyan-100 overflow-auto">
                <Header menuData={menuData} />
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-red-500">Error: {error.message || 'Unknown error'}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen flex flex-col items-center bg-cyan-100 overflow-auto">
            <ToastContainer />
            <Header menuData={menuData} />
            <Nav
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={handlePageChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                menuData={menuData}
            />
            <div className="flex-1 flex w-full overflow-hidden">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div className="px-4 w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {siswaData.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-slate-500 text-xl">Data Tidak Ditemukan</p>
                        </div>
                    ) : viewMode === "kanban" ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full h-full py-4">
                            {siswaData.map((siswa: Siswa, index: number) => (
                                <SiswaCard
                                    key={index}
                                    siswa={{
                                        nama: siswa.nama_siswa,
                                        nis: siswa.nis,
                                        nisn: siswa.nisn,
                                        kelas: siswa.nama_kelas,
                                        rombel: siswa.nama_rombel,
                                        ekskul: siswa.ekskul.map((e: any) => e.nama),
                                        foto: siswa.foto
                                    }}
                                    ekskulData={warnaEkskul}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full pb-4">
                            <SiswaTable
                                siswaData={siswaData}
                                sortConfig={sortConfig}
                                onSort={handleSort}
                                totalData={total}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                statusFilter={statusFilter}
                            />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
