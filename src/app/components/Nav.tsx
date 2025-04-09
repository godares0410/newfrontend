"use client";

import PCNav from "@/app/components/global/pcnav";

interface MenuItem {
  label: string;
  link: string;
}

interface MenuData {
  icon: string;
  label: string;
  menuItems: MenuItem[];
}

interface NavProps {
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

export default function Nav({
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
}: NavProps) {
  return (
    <>
      {/* Mobile navigation would go here */}
      
      {/* PC Navigation */}
      <PCNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        viewMode={viewMode}
        setViewMode={setViewMode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        menuData={menuData}
      />
    </>
  );
}