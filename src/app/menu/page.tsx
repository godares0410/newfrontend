import Image from "next/image";
import Link from "next/link";
import { IoMdChatboxes } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";

interface MenuBoxProps {
    src?: string;
    label: string;
    href: string;
}

const MenuBox = ({ src, label, href }: MenuBoxProps) => {
    return (
        <Link href={href}  className="flex flex-col items-center cursor-pointer group">
            <div className="h-17 w-17 md:h-21 md:w-21 lg:h-28 lg:w-28 bg-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.3)] rounded-2xl flex items-center justify-center p-3 lg:p-4 
                transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                {src && (
                    <Image
                        src={src}
                        alt={label}
                        width={80}
                        height={80}
                        style={{ objectFit: "contain" }}
                        priority
                    />
                )}
            </div>
            <div className="text-xs md:text-sm lg:text-md mt-3 md:mt-4 lg:mt-5 group-hover:text-yellow-500">{label}</div>
        </Link>
    );
};

export default function Menu() {
    const menuItems = [
        { src: "/img/aplikasi/Dashboard.svg", label: "Dashboard", href:"/dashboard" },
        { src: "/img/aplikasi/Siswa.svg", label: "Siswa", href:"/siswa" },
        { src: "/img/aplikasi/Teacher.svg", label: "Guru" },
        { src: "/img/aplikasi/Mapel.svg", label: "Mapel" },
        { label: "Kelas" },
        { label: "Organisasi" },
        { label: "Assessment" },
        { label: "Ekstrakulikuler" },
        { label: "Nilai" },
        { label: "Cetak" },
        { label: "Pembayaran" },
        { label: "Pengaturan" },
    ];

    return (
        <main className="min-h-screen p-2 lg:px-6 flex flex-col items-center bg-cyan-100">
            <div className="w-full h-12 flex justify-end items-center gap-3">
            <div className="lg:text-xl text-slate-700">SMK Sabilillah</div>
            <IoMdChatboxes className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer"/>
            <IoMdNotifications className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer"/>
            <FaUserCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer"/>
            </div>
            <div className="flex flex-wrap h-auto w-full justify-center p-2 lg:p-6">
                <div className="grid grid-cols-4 gap-x-3 gap-y-4 md:gap-x-15 md:gap-y-10 lg:grid-cols-6 lg:gap-x-10 lg:gap-y-10 py-3 lg:py-6 h-full w-fit mx-auto lg:p-6">
                    {menuItems.map((item, index) => (
                        <MenuBox key={index} src={item.src} label={item.label} href={item.href ?? "#"} />
                    ))}
                </div>
            </div>
        </main>
    );
}
