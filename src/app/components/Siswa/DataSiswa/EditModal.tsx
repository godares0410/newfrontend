// src/app/components/Siswa/DataSiswa/EditModal.tsx
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Siswa } from "@/app/components/types/siswa";
import { toast } from "react-toastify";

interface EditModalProps {
    siswa: Siswa;
    onClose: () => void;
    onSave: () => void; // Callback untuk refresh data setelah edit
    isOpen: boolean;
}

interface DropdownOption {
    value: number;
    label: string;
    warna?: string;
}

interface CurrentRelations {
    id_kelas: number;
    nama_kelas: string;
    id_jurusan: number;
    nama_jurusan: string;
    id_rombel: number;
    nama_rombel: string;
}

const EditModal = ({ siswa, onClose, onSave, isOpen }: EditModalProps) => {
    const [currentRelations, setCurrentRelations] = useState<CurrentRelations>({
        id_kelas: 0,
        nama_kelas: siswa.nama_kelas || '',
        id_jurusan: 0,
        nama_jurusan: siswa.nama_jurusan || '',
        id_rombel: 0,
        nama_rombel: siswa.nama_rombel || ''
    });

    const [formData, setFormData] = useState({
        nama_siswa: siswa.nama_siswa,
        nis: siswa.nis,
        nisn: siswa.nisn,
        id_kelas: 0,
        id_jurusan: 0,
        id_rombel: 0,
        status: siswa.status ? '1' : '0',
    });

    const [ekskulList, setEkskulList] = useState<DropdownOption[]>([]);
    const [kelasList, setKelasList] = useState<DropdownOption[]>([]);
    const [jurusanList, setJurusanList] = useState<DropdownOption[]>([]);
    const [rombelList, setRombelList] = useState<DropdownOption[]>([]);
    const [selectedEkskul, setSelectedEkskul] = useState<number[]>([]);
    const [newEkskul, setNewEkskul] = useState<number | ''>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch data dropdown dan relasi
                const [ekskulRes, kelasRes, jurusanRes, rombelRes, relationsRes] = await Promise.all([
                    axios.get('/api/ekskul'),
                    axios.get('/api/kelas'),
                    axios.get('/api/jurusan'),
                    axios.get('/api/rombel'),
                    axios.get(`/api/siswa/${siswa.id_siswa}/relations`)
                ]);

                // Set data dropdown
                setEkskulList(ekskulRes.data.map((e: any) => ({
                    value: e.id_ekskul,
                    label: e.nama_ekskul,
                    warna: e.warna
                })));

                setKelasList(kelasRes.data.map((k: any) => ({
                    value: k.id_kelas,
                    label: k.nama_kelas
                })));

                setJurusanList(jurusanRes.data.map((j: any) => ({
                    value: j.id_jurusan,
                    label: j.nama_jurusan
                })));

                setRombelList(rombelRes.data.map((r: any) => ({
                    value: r.id_rombel,
                    label: r.nama_rombel
                })));

                // Set current relations
                setCurrentRelations(relationsRes.data);

                // Set form data
                setFormData(prev => ({
                    ...prev,
                    id_kelas: relationsRes.data.id_kelas,
                    id_jurusan: relationsRes.data.id_jurusan,
                    id_rombel: relationsRes.data.id_rombel
                }));

                // Fetch ekskul siswa
                const siswaEkskulRes = await axios.get(`/api/siswa/${siswa.id_siswa}/ekskul`);
                setSelectedEkskul(siswaEkskulRes.data.map((e: any) => e.id_ekskul));

            } catch (error) {
                toast.error("Gagal memuat data");
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen, siswa.id_siswa]);

    // Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle tambah ekskul
    const handleAddEkskul = () => {
        if (newEkskul && !selectedEkskul.includes(newEkskul)) {
            setSelectedEkskul([...selectedEkskul, newEkskul]);
            setNewEkskul('');
        }
    };

    // Handle hapus ekskul
    const handleRemoveEkskul = (idEkskul: number) => {
        setSelectedEkskul(selectedEkskul.filter(id => id !== idEkskul));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedData = {
            nama_siswa: formData.nama_siswa,
            nis: formData.nis,
            nisn: formData.nisn,
            id_kelas: Number(formData.id_kelas),
            id_jurusan: Number(formData.id_jurusan),
            id_rombel: Number(formData.id_rombel),
            status: formData.status,
            id_ekskul: selectedEkskul,
            previous_relations: {
                id_kelas: Number(currentRelations.id_kelas),
                id_jurusan: Number(currentRelations.id_jurusan),
                id_rombel: Number(currentRelations.id_rombel)
            }
        };

        try {
            const response = await axios.put(`/api/siswa/${siswa.id_siswa}`, updatedData);

            if (response.data.message === "Data siswa berhasil diperbarui") {
                toast.success("Data siswa berhasil diperbarui");
                onSave(); // Refresh data
                onClose(); // Tutup modal
            } else {
                throw new Error(response.data.error || "Gagal memperbarui data");
            }
        } catch (error) {
            if (error instanceof Error) {
                // console.error("Detail error:", error.message);
                toast.error(`Gagal update: ${error.message}`);
            } else {
                console.error("Unknown error:", error);
                toast.error("Gagal update: Terjadi kesalahan yang tidak diketahui");
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30"
                        onClick={onClose}
                    />

                    {/* Modal container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Edit Data Siswa</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                                    aria-label="Tutup modal"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-5">
                                {isLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Nama Siswa */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nama Lengkap
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nama_siswa"
                                                    value={formData.nama_siswa}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    required
                                                />
                                            </div>

                                            {/* NIS */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    NIS
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nis"
                                                    value={formData.nis}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    required
                                                />
                                            </div>

                                            {/* NISN */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    NISN
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nisn"
                                                    value={formData.nisn}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    required
                                                />
                                            </div>

                                            {/* Kelas */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Kelas
                                                </label>
                                                <select
                                                    name="id_kelas"
                                                    value={formData.id_kelas || currentRelations.id_kelas}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    required
                                                >
                                                    <option value="">Pilih Kelas</option>
                                                    {kelasList.map(kelas => (
                                                        <option
                                                            key={kelas.value}
                                                            value={kelas.value}
                                                        >
                                                            {kelas.label}
                                                            {kelas.value === currentRelations.id_kelas && ' (Saat ini)'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {currentRelations.id_kelas > 0 && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Terpilih saat ini: {currentRelations.nama_kelas}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Jurusan */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jurusan
                                                </label>
                                                <select
                                                    name="id_jurusan"
                                                    value={formData.id_jurusan || currentRelations.id_jurusan}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    required
                                                >
                                                    <option value="">Pilih Jurusan</option>
                                                    {jurusanList.map(jurusan => (
                                                        <option
                                                            key={jurusan.value}
                                                            value={jurusan.value}
                                                        >
                                                            {jurusan.label}
                                                            {jurusan.value === currentRelations.id_jurusan && ' (Saat ini)'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {currentRelations.id_jurusan > 0 && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Terpilih saat ini: {currentRelations.nama_jurusan}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Rombel */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rombel
                                                </label>
                                                <select
                                                    name="id_rombel"
                                                    value={formData.id_rombel || currentRelations.id_rombel}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    required
                                                >
                                                    <option value="">Pilih Rombel</option>
                                                    {rombelList.map(rombel => (
                                                        <option
                                                            key={rombel.value}
                                                            value={rombel.value}
                                                        >
                                                            {rombel.label}
                                                            {rombel.value === currentRelations.id_rombel && ' (Saat ini)'}
                                                        </option>
                                                    ))}
                                                </select>
                                                {currentRelations.id_rombel > 0 && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Terpilih saat ini: {currentRelations.nama_rombel}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    required
                                                >
                                                    <option value="1">Aktif</option>
                                                    <option value="0">Non-Aktif</option>
                                                </select>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Status saat ini: {siswa.status ? 'Aktif' : 'Non-Aktif'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Ekstrakurikuler */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-medium text-gray-700 mb-3">Ekstrakurikuler</h4>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {selectedEkskul.map(idEkskul => {
                                                    const ekskul = ekskulList.find(e => e.value === idEkskul);
                                                    return ekskul ? (
                                                        <div key={idEkskul} className="flex items-center">
                                                            <span
                                                                className="px-3 py-1 text-xs rounded-full flex items-center gap-1"
                                                                style={{ backgroundColor: `${ekskul.warna}20`, color: ekskul.warna }}
                                                            >
                                                                {ekskul.label}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveEkskul(idEkskul)}
                                                                    className="ml-1 text-red-400 hover:text-red-600"
                                                                >
                                                                    <FaTrash className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                            <div className="flex gap-2">
                                                <select
                                                    value={newEkskul}
                                                    onChange={(e) => setNewEkskul(Number(e.target.value))}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                >
                                                    <option value="">Pilih Ekstrakurikuler</option>
                                                    {ekskulList
                                                        .filter(e => !selectedEkskul.includes(e.value))
                                                        .map(ekskul => (
                                                            <option key={ekskul.value} value={ekskul.value}>
                                                                {ekskul.label}
                                                            </option>
                                                        ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={handleAddEkskul}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                    disabled={!newEkskul}
                                                >
                                                    <FaPlus /> Tambah
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                                    disabled={isLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditModal;