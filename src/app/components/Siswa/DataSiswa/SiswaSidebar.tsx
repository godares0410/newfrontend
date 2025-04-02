import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
    return (
        <div className={`h-full bg-red-200 transition-all duration-300 ${isCollapsed ? "w-5" : "w-62"} hidden md:block`}>
            <div className={`flex justify-end ${isCollapsed ? "p-1" : "px-3"}`}>
                {isCollapsed ? (
                    <FaAngleDoubleRight className="mt-3 text-sm cursor-pointer" onClick={() => setIsCollapsed(false)} />
                ) : (
                    <FaAngleDoubleLeft className="mt-3 text-sm cursor-pointer" onClick={() => setIsCollapsed(true)} />
                )}
            </div>
        </div>
    );
};

export default Sidebar;
