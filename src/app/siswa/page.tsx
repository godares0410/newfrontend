// Siswa.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Header from "../components/Header";
import Nav from "../components/Nav";
import SiswaCard from "../components/Siswa/DataSiswa/SiswaCard";
import SiswaTable from "../components/Siswa/DataSiswa/SiswaTable";

type Siswa = {
    id_siswa: number;
    kode_siswa: string;
    nisn: string;
    nis: string;
    nama_siswa: string;
    jenis_kelamin: string;
    tahun_masuk: number;
    foto: string;
    status: string;
    id_sekolah: number;
    created_at: string;
    updated_at: string;
    nama_kelas: string;
    nama_jurusan: string;
    nama_rombel: string;
    ekskul: { nama: string; warna: string }[];
};

type Ekskul = {
    nama: string;
    warna: string;
};

type SortConfig = {
    key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas';
    order: 'asc' | 'desc';
};

export default function Siswa() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [siswaData, setSiswaData] = useState<Siswa[]>([]);
    const [ekskulData, setEkskulData] = useState<Ekskul[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
    const itemsPerPage = 100;
    const [total, setTotal] = useState(0);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'nama_siswa',
        order: 'asc'
    });

    const menuData = {
        icon: "/img/aplikasi/Siswa.svg",
        label: "Siswa",
        menuItems: [
            { label: "Daftar Siswa", link: "/siswa/daftar-siswa" },
            { label: "Buku Induk", link: "/siswa/buku-induk" },
            { label: "Catatan", link: "/siswa/catatan" },
            { label: "Laporan", link: "/siswa/laporan" },
        ],
    };

    const handleSort = (key: 'nama_siswa' | 'nis' | 'nisn' | 'nama_kelas') => {
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
        const fetchData = async () => {
            try {
                const response = await axios.get<{ data_siswa: Siswa[]; total: number }>("/api/siswa", {
                    params: {
                        page: currentPage,
                        search: searchQuery,
                        sort: sortConfig.key,
                        order: sortConfig.order,
                    },
                });

                const dataSiswa = response.data.data_siswa || [];
                setSiswaData(dataSiswa);
                setTotal(response.data.total);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));

                const warnaEkskul = dataSiswa.flatMap(siswa =>
                    siswa.ekskul.map(e => ({ nama: e.nama, warna: e.warna }))
                );

                const uniqueWarnaEkskul = Array.from(new Set(warnaEkskul.map(e => e.nama)))
                    .map(nama => {
                        return warnaEkskul.find(e => e.nama === nama);
                    })
                    .filter((e): e is Ekskul => e !== undefined);

                setEkskulData(uniqueWarnaEkskul);
                setIsLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentPage, searchQuery, sortConfig]);

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
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen flex flex-col items-center bg-cyan-100 overflow-auto">
            <Header menuData={menuData} />
            <Nav
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={handlePageChange}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
            <div className="flex-1 flex w-full overflow-hidden">
                <div className={`h-full bg-red-200 transition-all duration-300 ${isCollapsed ? "w-5" : "w-62"} hidden md:block`}>
                    <div className={`flex justify-end ${isCollapsed ? "p-1" : "px-3"}`}>
                        {isCollapsed ? (
                            <FaAngleDoubleRight className="mt-3 text-sm cursor-pointer" onClick={() => setIsCollapsed(false)} />
                        ) : (
                            <FaAngleDoubleLeft className="mt-3 text-sm cursor-pointer" onClick={() => setIsCollapsed(true)} />
                        )}
                    </div>
                </div>
                <div className="w-full h-full p-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {siswaData.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-slate-500 text-xl">Data Tidak Ditemukan</p>
                        </div>
                    ) : viewMode === "kanban" ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
                            {siswaData.map((siswa, index) => (
                                <SiswaCard
                                    key={index}
                                    siswa={{
                                        nama: siswa.nama_siswa,
                                        nis: siswa.nis,
                                        nisn: siswa.nisn,
                                        kelas: siswa.nama_kelas,
                                        rombel: siswa.nama_rombel,
                                        ekskul: siswa.ekskul.map(e => e.nama),
                                        foto: siswa.foto
                                    }}
                                    ekskulData={ekskulData}
                                />
                            ))}
                        </div>
                    ) : (
                        <SiswaTable
                            siswaData={siswaData}
                            sortConfig={sortConfig}
                            onSort={handleSort}
                            totalData={total}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}