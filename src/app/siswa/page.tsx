"use client";

import { useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Header from "../components/Header";
import Nav from "../components/Nav";
import SiswaCard from "../components/Siswa/DataSiswa/SiswaCard";

// const siswaData = [
//     {
//         nama: "Fahmi Ramadhan Fahmi Ramadhan",
//         nis: "220101",
//         nisn: "0056789123",
//         kelas: "XII - Rekayasa Perangkat Lunak",
//         rombel: "XII - RPL 1",
//         ekskul: ["Osis", "Paskibra"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Aisyah Putri",
//         nis: "220102",
//         nisn: "0056789124",
//         kelas: "XI - Desain Komunikasi Visual",
//         rombel: "XI - DKV 2",
//         ekskul: ["Pramuka"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Bintang Mahardika",
//         nis: "220103",
//         nisn: "0056789125",
//         kelas: "X - Teknik Jaringan Komputer",
//         rombel: "X - TKJ 1",
//         ekskul: ["Basket", "KIR"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Citra Melati",
//         nis: "220104",
//         nisn: "0056789126",
//         kelas: "XII - Akuntansi",
//         rombel: "XII - AKT 3",
//         ekskul: ["Paskibra", "Basket"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Dian Purnama",
//         nis: "220105",
//         nisn: "0056789127",
//         kelas: "XI - Teknik Mesin",
//         rombel: "XI - TM 2",
//         ekskul: ["KIR", "Osis"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Eko Saputro",
//         nis: "220106",
//         nisn: "0056789128",
//         kelas: "X - Farmasi",
//         rombel: "X - FAR 1",
//         ekskul: ["Basket"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Fitri Handayani",
//         nis: "220107",
//         nisn: "0056789129",
//         kelas: "XII - Multimedia",
//         rombel: "XII - MM 1",
//         ekskul: ["Osis", "Pramuka"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Gilang Pratama",
//         nis: "220108",
//         nisn: "0056789130",
//         kelas: "XI - Teknik Elektro",
//         rombel: "XI - TE 2",
//         ekskul: ["Pramuka", "Paskibra"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Hana Salsabila",
//         nis: "220109",
//         nisn: "0056789131",
//         kelas: "X - Teknik Otomotif",
//         rombel: "X - TO 1",
//         ekskul: ["Paskibra", "KIR"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     },
//     {
//         nama: "Iqbal Ramadhan",
//         nis: "220110",
//         nisn: "0056789132",
//         kelas: "XII - Rekayasa Perangkat Lunak",
//         rombel: "XII - RPL 2",
//         ekskul: ["KIR"],
//         foto: "/img/siswa/sabilillah/A. Asfihani_1716972308.jpg"
//     }
// ];

const siswaData = Array.from({ length: 1000 }, (_, i) => {
    const ekskulList = ["Osis", "Pramuka", "Basket", "Paskibra", "KIR"];
    return {
        nama: `Siswa ${i + 1}`,
        nis: (220100 + i + 1).toString(),
        nisn: (56789123 + i + 1).toString(),
        kelas: `X${i % 3 + 1} - Jurusan ${i % 5 + 1}`,
        rombel: `X${i % 3 + 1} - R${i % 4 + 1}`,
        ekskul: ekskulList.filter(() => Math.random() > 0.5),
        foto: `/img/siswa/sabilillah/A. Asfihani_1716972308.jpg`
    };
});

const ekskulData = [
    { nama: "Osis", warna: "bg-emerald-700" },
    { nama: "Pramuka", warna: "bg-blue-600" },
    { nama: "Basket", warna: "bg-red-600" },
    { nama: "Paskibra", warna: "bg-yellow-600" },
    { nama: "KIR", warna: "bg-purple-600" }
];

export default function Siswa() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;

    // Fungsi untuk memfilter data siswa berdasarkan searchQuery
    const filteredSiswaData = siswaData.filter(siswa =>
        siswa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        siswa.nis.includes(searchQuery) ||
        siswa.nisn.includes(searchQuery)
    );

    // Menghitung total halaman
    const totalPages = Math.ceil(filteredSiswaData.length / itemsPerPage);

    // Menghitung data yang akan ditampilkan berdasarkan halaman saat ini
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSiswaData = filteredSiswaData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <main className="h-screen flex flex-col items-center bg-cyan-100 overflow-auto">
            <Header />
            {/* Nav */}
            <Nav
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
            {/* End Nav */}
            <div className="flex-1 flex w-full overflow-hidden">
                <div className={`h-full bg-red-200 transition-all duration-300 ${isCollapsed ? "w-12" : "w-62"}`}>
                    <div className="flex justify-end px-3">
                        {isCollapsed ? (
                            <FaAngleDoubleRight className="mt-3 text-sm cursor-pointer" onClick={() => setIsCollapsed(false)} />
                        ) : (
                            <FaAngleDoubleLeft className="mt-3 text-sm cursor-pointer" onClick={() => setIsCollapsed(true)} />
                        )}
                    </div>
                </div>
                <div className="w-full h-full p-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 w-full">
                        {currentSiswaData.map((siswa, index) => (
                            <SiswaCard key={index} siswa={siswa} ekskulData={ekskulData} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}