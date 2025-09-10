import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { Siswa } from "@/app/components/types/siswa";
import { useEffect } from "react";

interface DetailModalProps {
    siswa: Siswa;
    onClose: () => void;
    isOpen: boolean;
}

const DetailModal = ({ siswa, onClose, isOpen }: DetailModalProps) => {
    // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    {/* Overlay dengan animasi fade */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30"
                        onClick={onClose}
                    />

                    {/* Modal container dengan animasi scale */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header dengan gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Detail Siswa</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <FaTimes className="w-5 h-5 cursor-pointer" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <div className="flex items-start gap-5">
                                {siswa.foto && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={`/img/siswa/sabilillah/${siswa.foto}`}
                                            alt={siswa.nama_siswa}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {siswa.nama_siswa}
                                    </h2>
                                    <p className="text-blue-600 font-medium">{siswa.nis}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        Informasi Pribadi
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">NISN</p>
                                            <p className="font-medium">{siswa.nisn}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Jenis Kelamin</p>
                                            <p className="font-medium">{siswa.jenis_kelamin}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Tahun Masuk</p>
                                            <p className="font-medium">{siswa.tahun_masuk}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Informasi Akademik
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Kelas</p>
                                            <p className="font-medium">{siswa.nama_kelas}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Rombel</p>
                                            <p className="font-medium">{siswa.nama_rombel}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <p className="font-medium">
                                                <span className={`px-2 py-1 rounded-full text-xs ${siswa.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {siswa.status ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    Ekstrakurikuler
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {siswa.ekskul.map((e, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1"
                                            style={{ backgroundColor: `${e.warna}20`, color: e.warna }}
                                        >
                                            {e.nama}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DetailModal;