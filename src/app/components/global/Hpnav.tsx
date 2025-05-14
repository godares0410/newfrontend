"use client";

import { IoMdSearch } from "react-icons/io";
import { FaCheck, FaAngleLeft, FaAngleRight, FaList } from "react-icons/fa";
import { IoMdChatboxes, IoMdNotifications } from "react-icons/io";
import { RiUserAddLine } from "react-icons/ri";
import { MdArchive } from "react-icons/md";
import { TbLayoutKanbanFilled, TbChevronCompactDown } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

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
                className={`flex cursor-pointer items-center justify-center  gap-2 px-4 py-1 rounded-lg text-xs font-medium transition-colors ${value ? ' text-emerald-800' : ' text-slate-800'} min-w-[120px] hover:opacity-90`}
            >
                <div className="flex flex-col items-center justify-center -space-y-2">
                    <div className="flex items-center justify-center text-sm font-bold">
                        {value ? "Aktif" : "Arsip"}
                    </div>
                    <TbChevronCompactDown className={`text-lg font-extrabold transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>

            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-28 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
                    <button
                        onClick={() => handleSelect(true)}
                        className={`flex cursor-pointer items-center w-28 px-4 py-2 text-xs ${value ? 'bg-emerald-50 text-emerald-800 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                        <FaCheck className={`mr-2 ${value ? "opacity-100" : "opacity-0"}`} />
                        Aktif
                    </button>
                    <button
                        onClick={() => handleSelect(false)}
                        className={`flex cursor-pointer items-center w-28 px-4 py-2 text-xs ${!value ? 'bg-amber-50 text-amber-800 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                        <MdArchive className={`mr-2 ${!value ? "opacity-100" : "opacity-0"}`} />
                        Arsip
                    </button>
                </div>
            )}
        </div>
    );
};

interface MenuItem {
    label: string;
    link: string;
}

interface MenuData {
    icon: string;
    label: string;
    menuItems: MenuItem[];
}

interface PCNavProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    viewMode: "kanban" | "list";
    setViewMode: (mode: "kanban" | "list") => void;
    statusFilter: boolean;
    setStatusFilter: (status: boolean) => void;
    menuData: MenuData;
}

export default function PCNav({
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    setCurrentPage,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    menuData
}: PCNavProps) {
    const pathname = usePathname();
    const [showSearch, setShowSearch] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const getCurrentTitle = () => {
        if (pathname === '/siswa' || pathname === '/siswa/') {
            return menuData.menuItems[0].label;
        }

        const matchedItem = menuData.menuItems.find(item =>
            pathname.startsWith(item.link)
        );

        return matchedItem ? matchedItem.label : menuData.menuItems[0].label;
    };

    const title = getCurrentTitle();

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch && searchInputRef.current) {
            // Focus the input when showing search
            setTimeout(() => searchInputRef.current?.focus(), 10);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission
        if (searchInputRef.current) {
            searchInputRef.current.blur(); // Remove focus from the input
        }
        // You can also handle the search logic here if needed
    };

    return (
        <>
            <div className="flex flex-col w-full mt-1 md:hidden shadow-sm">
                <div className="grid grid-cols-3 items-center justify-between px-2 mt-2">
                    <div className="flex">
                        <div className="h-7 w-7 bg-emerald-500 text-slate-200 p-1 rounded-lg flex items-center justify-center">

                            <RiUserAddLine className="text-xl" />
                        </div>

                    </div>
                    <div className="text-xl font-semibold text-slate-600 flex justify-center">{title}</div>
                    <div className="flex items-center gap-2 text-sm justify-end">
                        <IoMdChatboxes className="text-xl" />
                        <IoMdNotifications className="text-xl" />
                    </div>
                </div>
                <div className="w-full flex items-center justify-center">
                    <div className="py-2 px-3">
                        <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
                    </div>
                </div>
                {/* Action Row */}
                <div className="flex items-center justify-between py-2 px-3">

                    {/* View Toggles */}
                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg shadow-xs">
                        <button
                            type="button"
                            className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === "kanban"
                                ? "bg-white shadow-sm text-amber-500"
                                : "text-gray-500 hover:bg-gray-200"
                                }`}
                            onClick={() => setViewMode("kanban")}
                            title="Kanban View"
                        >
                            <TbLayoutKanbanFilled className="text-lg" />
                        </button>
                        <button
                            type="button"
                            className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === "list"
                                ? "bg-white shadow-sm text-amber-500"
                                : "text-gray-500 hover:bg-gray-200"
                                }`}
                            onClick={() => setViewMode("list")}
                            title="List View"
                        >
                            <FaList className="text-lg" />
                        </button>
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center mr-2">
                        <span className="text-sm text-gray-600 mr-1">{`${currentPage} dari ${totalPages}`}</span>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                className="bg-slate-200 p-1.5 shadow-xs rounded-md hover:bg-gray-100 transition-colors duration-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed active:bg-cyan-100 active:border active:border-cyan-500 active:scale-95"
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <FaAngleLeft />
                            </button>
                            <button
                                type="button"
                                className="bg-slate-200 p-1.5 shadow-xs rounded-md hover:bg-gray-100 transition-colors duration-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed active:bg-cyan-100 active:border active:border-cyan-500 active:scale-95"
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <FaAngleRight />
                            </button>
                        </div>
                        {/* Search Button */}
                        <button
                            type="button"
                            className={`ml-1 p-1.5 rounded-md transition-all duration-200 ${showSearch
                                ? 'bg-emerald-100 text-emerald-600 border border-emerald-500 shadow-xs'
                                : 'text-gray-500 hover:bg-gray-200 border border-transparent'
                                }`}
                            onClick={toggleSearch}
                            title="Search"
                        >
                            <IoMdSearch className="text-lg" />
                        </button>
                    </div>


                </div>

                {/* Search Input */}
                <div className="px-3">

                    <div className={`overflow-hidden transition-all duration-300 ${showSearch ? 'max-h-20 mt-1 mb-2 border border-emerald-500 rounded-lg' : 'max-h-0'}`}>
                        <form
                            onSubmit={handleSearchSubmit}
                            className="bg-white border border-gray-200 rounded-lg shadow-xs p-1.5"
                        >
                            <div className="flex items-center py-1 px-2">
                                <IoMdSearch className="text-gray-400 mr-2" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                </div>

            </div >

        </>
    );
}