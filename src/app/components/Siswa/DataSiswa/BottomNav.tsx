"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { 
  FaHome, 
  FaCamera, 
  FaChevronUp,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaChartBar
} from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { MdClose } from "react-icons/md";

const BottomNav = () => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get active icon based on current route
  const getActiveIcon = () => {
    if (pathname === "/siswa") return <FaUserGraduate className="text-lg" />;
    if (pathname === "/siswa/buku-induk") return <FaBook className="text-lg" />;
    if (pathname === "/siswa/catatan") return <FaClipboardList className="text-lg" />;
    if (pathname === "/siswa/laporan") return <FaChartBar className="text-lg" />;
    return <FaUserGraduate className="text-lg" />;
  };

  const mainMenuItems = [
    { label: "Menu", icon: <FaHome className="text-lg" />, href: "/menu" },
    { 
      label: "Data Siswa", 
      icon: (
        <div className="relative">
          {isProfileOpen ? (
            <MdClose className="text-lg" />
          ) : (
            getActiveIcon()
          )}
          <FaChevronUp
            className={`absolute -bottom-1 -right-2 text-xs bg-cyan-500 text-white rounded-full p-0.5 transition-all duration-200 ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      ),
      href: "#",
      onClick: () => setIsProfileOpen(!isProfileOpen) 
    },
    { label: "Chat", icon: <IoMdChatbubbles className="text-lg" />, href: "/chat" },
    { label: "Camera", icon: <FaCamera className="text-lg" />, href: "/camera" },
    { label: "Settings", icon: <FiSettings className="text-lg" />, href: "/settings" },
  ];

  const profileMenuItems = [
    { label: "Data Siswa", icon: <FaUserGraduate className="mr-2" />, link: "/siswa" },
    { label: "Buku Induk", icon: <FaBook className="mr-2" />, link: "/siswa/buku-induk" },
    { label: "Catatan", icon: <FaClipboardList className="mr-2" />, link: "/siswa/catatan" },
    { label: "Laporan", icon: <FaChartBar className="mr-2" />, link: "/siswa/laporan" },
  ];

  // Determine active submenu label
  const activeLabel = (() => {
    if (pathname === "/siswa") return "Data Siswa";
    if (pathname === "/siswa/buku-induk") return "Buku Induk";
    if (pathname === "/siswa/catatan") return "Catatan";
    if (pathname === "/siswa/laporan") return "Laporan";
    return "Data Siswa";
  })();

  // Check if current path is exactly "/siswa"
  const isExactlySiswa = pathname === "/siswa";

  return (
    <>
      {/* Drop-up Menu */}
      <div 
        ref={menuRef}
        className={`fixed bottom-15 left-0 right-0 bg-white shadow-xl rounded-t-2xl mx-4 z-40 md:hidden transition-all duration-300 transform ${
          isProfileOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{
          boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <div className="flex justify-center pt-2">
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="p-2">
          {profileMenuItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link key={item.link} href={item.link} onClick={() => setIsProfileOpen(false)}>
                <div className="flex items-center px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <span className={`${isActive ? "text-orange-500" : "text-gray-600"}`}>
                    {item.icon}
                  </span>
                  <span className={`ml-2 font-medium ${isActive ? "text-orange-500" : "text-gray-800"}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Bottom Navigation */}
      <div 
        className="fixed bottom-0 bg-white px-4 py-3 shadow-lg flex items-center justify-between gap-4 w-full z-50 md:hidden"
        style={{
          boxShadow: "0 -2px 20px 0 rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)"
        }}
      >
        {mainMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const isDataSiswa = item.label === "Data Siswa";
          
          return (
            <div key={item.href} className="flex-1">
              {item.onClick ? (
                <button 
                  onClick={item.onClick} 
                  className="w-full focus:outline-none"
                  aria-label={item.label}
                >
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`text-xl transition-all duration-300 ${
                        isActive ? "opacity-0" : `text-gray-600 ${isDataSiswa ? 'text-orange-600' : 'hover:text-cyan-500'}`
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-xs mt-1 transition-all duration-300 ${
                        isActive 
                          ? "font-semibold bg-clip-text text-transparent" 
                          : isDataSiswa
                            ? "text-orange-500"
                            : "text-gray-500"
                      }`}
                    >
                      {isDataSiswa ? activeLabel : item.label}
                    </span>
                  </div>
                </button>
              ) : (
                <Link href={item.href} className="w-full" aria-label={item.label}>
                  <div className="flex flex-col items-center relative">
                    {isActive && (
                      <div className="absolute -top-6 flex items-center justify-center bg-gradient-to-r from-cyan-400 to-lime-400 rounded-full w-14 h-14 shadow-lg z-10 transition-all duration-300">
                        <div className="text-white">{item.icon}</div>
                      </div>
                    )}
                    <div
                      className={`text-xl transition-all duration-300 ${
                        isActive ? "opacity-0" : "text-gray-600 hover:text-cyan-500"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-xs mt-1 transition-all duration-300 ${
                        isActive 
                          ? "font-semibold bg-gradient-to-r from-cyan-500 to-lime-500 bg-clip-text text-transparent" 
                          : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;