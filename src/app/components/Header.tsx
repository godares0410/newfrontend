"use client";

import Topnav from "@/app/components/Siswa/DataSiswa/TopNav";
import BottomNav from "@/app/components/Siswa/DataSiswa/BottomNav";
import type { HeaderProps } from "@/app/components/types/siswa";

const Header = ({ menuData }: HeaderProps) => {
    return (
        <>
            <Topnav menuData={menuData} />
            <BottomNav />
            {/* Komponen lainnya seperti BottomNav, dll bisa ditambahkan di sini */}
        </>
    );
};

export default Header;
