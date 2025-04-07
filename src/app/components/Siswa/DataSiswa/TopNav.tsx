"use client";

import Link from "next/link";
import Image from "next/image";
import { IoMdChatboxes, IoMdNotifications, IoIosArrowBack } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import type { HeaderProps } from "@/app/components/types/siswa";

const Topnav = ({ menuData }: HeaderProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="hidden w-full h-12 lg:px-6 md:flex justify-between items-center">
            <div className="h-full flex justify-center items-center">
                <Link href="/menu">
                    <div
                        className="flex w-36 items-center gap-2 cursor-pointer transition-all duration-300"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div
                                className={`absolute transition-all duration-300 ${
                                    isHovered ? "-translate-x-5 opacity-0" : "translate-x-0 opacity-100"
                                }`}
                            >
                                <Image
                                    src={menuData.icon}
                                    alt={`${menuData.label} Icon`}
                                    width={30}
                                    height={30}
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                            <div
                                className={`absolute transition-all duration-300 ${
                                    isHovered ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
                                }`}
                            >
                                <IoIosArrowBack className="w-6 h-6 bg-transparent" />
                            </div>
                        </div>
                        <div className="text-xl text-slate-700 transition-all duration-300">
                            {isHovered ? "Menu" : menuData.label}
                        </div>
                    </div>
                </Link>
                <div className="flex gap-6">
                    {menuData.menuItems.map((item) => (
                        <Link key={item.link} href={item.link}>
                            <div className="text-lg text-slate-700 hover:text-amber-500 cursor-pointer">
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="lg:text-xl text-slate-700">SMK Sabilillah</div>
                <IoMdChatboxes className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer" />
                <IoMdNotifications className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer" />
                <FaUser className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer" />
            </div>
        </div>
    );
};

export default Topnav;
