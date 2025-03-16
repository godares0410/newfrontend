"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Header from "../components/Header";
import Nav from "../components/Nav";
import SiswaCard from "../components/Siswa/DataSiswa/SiswaCard";

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

export default function Siswa() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [siswaData, setSiswaData] = useState<Siswa[]>([]);
    const [ekskulData, setEkskulData] = useState<Ekskul[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban"); // Tambahkan state untuk mode tampilan
    const itemsPerPage = 100;
    const [sortBy, setSortBy] = useState<string | null>(null); // Kolom yang diurutkan
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Data menu untuk Header
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

    // Fungsi untuk meng-handle pengurutan
    const handleSort = (column: string) => {
        if (sortBy === column) {
            // Jika kolom yang sama di-klik, ubah arah pengurutan
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // Jika kolom berbeda di-klik, set kolom baru dan default ke ascending
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    // Fungsi untuk mengurutkan data
    const sortedData = [...siswaData].sort((a, b) => {
        if (!sortBy) return 0; // Jika tidak ada kolom yang diurutkan, kembalikan data asli

        const valueA = a[sortBy as keyof Siswa];
        const valueB = b[sortBy as keyof Siswa];

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<{ data_siswa: Siswa[]; total: number }>("/api/siswa", {
                    params: {
                        page: currentPage,
                        search: searchQuery,
                    },
                });
                setSiswaData(response.data.data_siswa);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage)); // Hitung total halaman

                const warnaEkskul = response.data.data_siswa.flatMap(siswa =>
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
    }, [currentPage, searchQuery]); // Fetch data saat halaman atau pencarian berubah

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
                viewMode={viewMode} // Tambahkan viewMode ke Nav
                setViewMode={setViewMode} // Tambahkan setViewMode ke Nav
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
                    {viewMode === "kanban" ? (
                        // Tampilan Kanban
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
                        // Tampilan List/Table
                        <div className="w-full overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="px-4 py-2 border-b border-slate-200 text-center">No</th> {/* Kolom No */}
                                        <th className="px-4 py-2 border-b border-slate-200 text-center">Nama</th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-center">NIS</th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-center">NISN</th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-center">Kelas</th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-center">Rombel</th>
                                        <th className="px-4 py-2 border-b border-slate-200 text-center">Ekskul</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {siswaData.map((siswa, index) => (
                                        <tr
                                            key={index}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} text-slate-600`} // Warna latar belakang dan teks
                                        >
                                            <td className="px-4 py-2 border-b border-slate-200 text-center">{index + 1}</td> {/* Nomor urut */}
                                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nama_siswa}</td>
                                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nis}</td>
                                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nisn}</td>
                                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nama_kelas}</td>
                                            <td className="px-4 py-2 border-b border-slate-200 text-center">{siswa.nama_rombel}</td>
                                            <td className="px-4 py-2 border-b border-slate-200 text-center">
                                                {siswa.ekskul.map((e, i) => (
                                                    <span key={i} className="mr-1">{e.nama}</span>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}