import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import QRCode from 'react-qr-code';
import {
    Save, ArrowLeft, Camera, Trash2, Plus,
    User, AlertCircle, FileText, Users
} from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { karyawanService } from '@/services/karyawan.service';
import {
    divisiService, departmentService, posisiJabatanService,
    jenisHubunganKerjaService, kategoriPangkatService, golonganService,
    subGolonganService, lokasiKerjaService, statusKaryawanService, tagService
} from '@/services/master.service';
import type { CreateKaryawanInput } from '@/types/karyawan.types';

export default function KaryawanDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = id && id !== 'baru';

    // State
    const [formData, setFormData] = useState<Partial<CreateKaryawanInput>>({
        anak: [],
        saudara_kandung: []
    });
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState('');
    const [activeTab, setActiveTab] = useState('personal');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Data Fetch
    const { data: detailData, isLoading: isLoadingDetail } = useQuery({
        queryKey: ['karyawan-detail', id],
        queryFn: () => karyawanService.getById(id!),
        enabled: !!isEdit,
    });

    useEffect(() => {
        if (detailData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(detailData);
            if (detailData.foto_karyawan) {
                setFotoPreviewUrl(detailData.foto_karyawan);
            }
        }
    }, [detailData]);

    // Master Data Queries
    const { data: divisiList = [] } = useQuery({ queryKey: ['md-divisi'], queryFn: () => divisiService.getDropdown() });
    const { data: deptList = [] } = useQuery({ queryKey: ['md-department'], queryFn: () => departmentService.getDropdown() });
    const { data: posisiList = [] } = useQuery({ queryKey: ['md-posisi'], queryFn: () => posisiJabatanService.getDropdown() });
    const { data: jhkList = [] } = useQuery({ queryKey: ['md-jhk'], queryFn: () => jenisHubunganKerjaService.getDropdown() });
    const { data: kategoriPangkatList = [] } = useQuery({ queryKey: ['md-kat-pangkat'], queryFn: () => kategoriPangkatService.getDropdown() });
    const { data: golonganList = [] } = useQuery({ queryKey: ['md-golongan'], queryFn: () => golonganService.getDropdown() });
    const { data: subGolonganList = [] } = useQuery({ queryKey: ['md-subgolongan'], queryFn: () => subGolonganService.getDropdown() });
    const { data: lokasiList = [] } = useQuery({ queryKey: ['md-lokasi'], queryFn: () => lokasiKerjaService.getDropdown() });
    const { data: statusList = [] } = useQuery({ queryKey: ['md-status'], queryFn: () => statusKaryawanService.getDropdown() });
    const { data: tagList = [] } = useQuery({ queryKey: ['md-tag'], queryFn: () => tagService.getDropdown() });

    // Karyawan Dropdown for Manager/Atasan (aktif only)
    const { data: karyawanListRes } = useQuery({
        queryKey: ['karyawan-dropdown'],
        queryFn: () => karyawanService.getList({ limit: 200 })
    });
    const karyawanOptions = (karyawanListRes?.data || []).map(k => ({
        value: k.id,
        label: `${k.nama_lengkap} (${k.nomor_induk_karyawan})`
    }));

    // Helpers to convert to options
    const toOptions = <T,>(list: T[], valueKey: keyof T, labelKey: keyof T) =>
        list.map(item => ({ value: String(item[valueKey]), label: String(item[labelKey]) }));

    // Handlers
    const handleChange = (field: keyof CreateKaryawanInput, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFotoFile(file);
            setFotoPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Dynamic Arrays Logic
    const handleJumlahAnakChange = (val: number) => {
        const targetAnak = val;
        setFormData(prev => {
            const currentAnak = prev.anak || [];
            let newAnak = [...currentAnak];
            if (currentAnak.length !== targetAnak) {
                if (currentAnak.length < targetAnak) {
                    // Add items
                    const newItems = Array(targetAnak - currentAnak.length).fill({
                        nama_anak: '', jenis_kelamin: 'Laki-Laki', tanggal_lahir: '', keterangan: ''
                    });
                    newAnak = [...currentAnak, ...newItems];
                } else {
                    // Remove items
                    newAnak = currentAnak.slice(0, targetAnak);
                }
            }
            return { ...prev, jumlah_anak: targetAnak, anak: newAnak };
        });
    };

    const handleAddSaudara = () => {
        if ((formData.saudara_kandung || []).length < 5) {
            setFormData(prev => ({
                ...prev,
                saudara_kandung: [
                    ...(prev.saudara_kandung || []),
                    { nama_saudara_kandung: '', jenis_kelamin: 'Laki-Laki', tanggal_lahir: '', pendidikan_terakhir: '', pekerjaan: '', keterangan: '' }
                ]
            }));
        }
    };

    const handleRemoveSaudara = (index: number) => {
        setFormData(prev => ({
            ...prev,
            saudara_kandung: prev.saudara_kandung?.filter((_, i) => i !== index)
        }));
    };

    const handleArrayChange = (arrayName: 'anak' | 'saudara_kandung', index: number, field: string, value: unknown) => {
        setFormData(prev => {
            const newArray = [...(prev[arrayName] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    // Mutations
    const mutation = useMutation({
        mutationFn: async (data: CreateKaryawanInput) => {
            let res;
            if (isEdit) {
                res = await karyawanService.update(id!, data);
            } else {
                res = await karyawanService.create(data);
            }

            // If there's a new photo, upload it
            if (fotoFile) {
                const targetId = isEdit ? id! : res.id;
                await karyawanService.uploadFoto(targetId, fotoFile);
            }

            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['karyawan-list'] });
            navigate('/hr/karyawan');
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            setErrorMsg(err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    });

    const handleSave = () => {
        // Validation
        const requiredFields = ['nama_lengkap', 'nomor_induk_karyawan', 'divisi_id', 'department_id', 'posisi_jabatan_id', 'status_karyawan_id', 'lokasi_kerja_id'];
        for (const field of requiredFields) {
            if (!formData[field as keyof CreateKaryawanInput]) {
                const fieldName = field.replace('_id', '').replace(/_/g, ' ');
                setErrorMsg(`Field ${fieldName} wajib diisi`);
                return;
            }
        }

        mutation.mutate(formData as CreateKaryawanInput);
    };

    if (isEdit && isLoadingDetail) {
        return <div className="p-8 text-center text-white">Loading detail...</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/hr/karyawan')}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {isEdit ? 'Detail Karyawan' : 'Tambah Karyawan'}
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/hr/karyawan')}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors cursor-pointer text-sm font-medium disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan Karyawan'}
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">{errorMsg}</p>
                </div>
            )}

            {/* Profile Head Section */}
            <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/10 flex flex-col md:flex-row gap-8">
                {/* Photo & Upload */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                            {fotoPreviewUrl ? (
                                <img src={fotoPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-neutral-600" />
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-neutral-500 max-w-[140px]">Format JPG/PNG maks. 2MB</p>
                    </div>
                </div>

                {/* Primary Info Form */}
                <div className="flex-1 max-w-2xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            label="Nama Lengkap *"
                            value={formData.nama_lengkap}
                            onChange={(val) => handleChange('nama_lengkap', val)}
                            placeholder="John Doe"
                        />
                        <TextInput
                            label="Nomor Induk Karyawan (NIK) *"
                            value={formData.nomor_induk_karyawan}
                            onChange={(val) => handleChange('nomor_induk_karyawan', val)}
                            placeholder="NIK00001"
                        />
                        <ComboboxInput
                            label="Divisi *"
                            value={formData.divisi_id}
                            onChange={(val) => handleChange('divisi_id', val)}
                            options={toOptions(divisiList, 'id', 'nama_divisi')}
                        />
                        <ComboboxInput
                            label="Department *"
                            value={formData.department_id}
                            onChange={(val) => handleChange('department_id', val)}
                            options={toOptions(deptList, 'id', 'nama_department')}
                        />
                        <ComboboxInput
                            label="Posisi Jabatan *"
                            value={formData.posisi_jabatan_id}
                            onChange={(val) => handleChange('posisi_jabatan_id', val)}
                            options={toOptions(posisiList, 'id', 'nama_posisi_jabatan')}
                        />
                        <ComboboxInput
                            label="Status Karyawan *"
                            value={formData.status_karyawan_id}
                            onChange={(val) => handleChange('status_karyawan_id', val)}
                            options={toOptions(statusList, 'id', 'nama_status')}
                        />
                        <ComboboxInput
                            label="Lokasi Kerja *"
                            value={formData.lokasi_kerja_id}
                            onChange={(val) => handleChange('lokasi_kerja_id', val)}
                            options={toOptions(lokasiList, 'id', 'nama_lokasi_kerja')}
                        />
                    </div>
                </div>

                {/* QR Code */}
                <div className="hidden lg:flex shrink-0 w-32 items-center justify-center border-l border-white/10 pl-8">
                    {formData.nomor_induk_karyawan ? (
                        <div className="p-3 bg-white rounded-xl">
                            <QRCode
                                value={formData.nomor_induk_karyawan}
                                size={96}
                                level="M"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-xl bg-white/5 flex items-center justify-center border border-dashed border-white/10">
                            <p className="text-[10px] text-neutral-500 text-center px-2">Isi NIK untuk melihat QR</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Info Tabs */}
            <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="bg-[#0a0a0f] rounded-2xl border border-white/10">
                <Tabs.List className="flex border-b border-white/10 overflow-x-auto">
                    <Tabs.Trigger
                        value="personal"
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap outline-none cursor-pointer ${activeTab === 'personal' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" /> Personal Information
                        </div>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="hr"
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap outline-none cursor-pointer ${activeTab === 'hr' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Informasi HR
                        </div>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="keluarga"
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap outline-none cursor-pointer ${activeTab === 'keluarga' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" /> Informasi Keluarga
                        </div>
                    </Tabs.Trigger>
                </Tabs.List>

                {/* TAB 1: Personal Information */}
                <Tabs.Content value="personal" className="p-6 space-y-8 outline-none focus:ring-0">
                    <FormGroup title="1. Biodata Karyawan">
                        <ReadonlyField label="Nama Lengkap" value={formData.nama_lengkap} />
                        <ComboboxInput
                            label="Jenis Kelamin"
                            value={formData.jenis_kelamin}
                            onChange={(val) => handleChange('jenis_kelamin', val)}
                            options={[{ value: 'Laki-Laki', label: 'Laki-Laki' }, { value: 'Perempuan', label: 'Perempuan' }]}
                        />
                        <TextInput label="Tempat Lahir" value={formData.tempat_lahir} onChange={(val) => handleChange('tempat_lahir', val)} />
                        <DateInput label="Tanggal Lahir" value={formData.tanggal_lahir} onChange={(val) => handleChange('tanggal_lahir', val)} />
                        <TextInput label="Email Pribadi" type="email" value={formData.email_pribadi} onChange={(val) => handleChange('email_pribadi', val)} />
                    </FormGroup>

                    <FormGroup title="2. Identifikasi">
                        <ComboboxInput
                            label="Agama"
                            value={formData.agama}
                            onChange={(val) => handleChange('agama', val)}
                            options={[
                                { value: 'Islam', label: 'Islam' }, { value: 'Kristen', label: 'Kristen' },
                                { value: 'Katolik', label: 'Katolik' }, { value: 'Hindu', label: 'Hindu' },
                                { value: 'Buddha', label: 'Buddha' }, { value: 'Konghucu', label: 'Konghucu' }
                            ]}
                        />
                        <ComboboxInput
                            label="Golongan Darah"
                            value={formData.golongan_darah}
                            onChange={(val) => handleChange('golongan_darah', val)}
                            options={[
                                { value: 'A', label: 'A' }, { value: 'B', label: 'B' },
                                { value: 'AB', label: 'AB' }, { value: 'O', label: 'O' }
                            ]}
                        />
                        <TextInput label="Nomor Kartu Keluarga" value={formData.nomor_kartu_keluarga} onChange={(val) => handleChange('nomor_kartu_keluarga', val)} />
                        <TextInput label="Nomor KTP" value={formData.nomor_ktp} onChange={(val) => handleChange('nomor_ktp', val)} />
                        <TextInput label="Nomor NPWP" value={formData.nomor_npwp} onChange={(val) => handleChange('nomor_npwp', val)} />
                        <TextInput label="Nomor BPJS" value={formData.nomor_bpjs} onChange={(val) => handleChange('nomor_bpjs', val)} />
                        <TextInput label="No NIK/KK" value={formData.no_nik_kk} onChange={(val) => handleChange('no_nik_kk', val)} />
                        <TextInput label="Status Pajak" value={formData.status_pajak} onChange={(val) => handleChange('status_pajak', val)} />
                    </FormGroup>

                    <FormGroup title="3. Alamat Domisili">
                        <div className="md:col-span-2">
                            <TextareaInput label="Alamat Lengkap" value={formData.alamat_domisili} onChange={(val) => handleChange('alamat_domisili', val)} />
                        </div>
                        <TextInput label="Kota" value={formData.kota_domisili} onChange={(val) => handleChange('kota_domisili', val)} />
                        <TextInput label="Provinsi" value={formData.provinsi_domisili} onChange={(val) => handleChange('provinsi_domisili', val)} />
                    </FormGroup>

                    <FormGroup title="4. Alamat KTP">
                        <div className="md:col-span-2">
                            <TextareaInput label="Alamat Lengkap" value={formData.alamat_ktp} onChange={(val) => handleChange('alamat_ktp', val)} />
                        </div>
                        <TextInput label="Kota" value={formData.kota_ktp} onChange={(val) => handleChange('kota_ktp', val)} />
                        <TextInput label="Provinsi" value={formData.provinsi_ktp} onChange={(val) => handleChange('provinsi_ktp', val)} />
                    </FormGroup>

                    <FormGroup title="5. Informasi Kontak">
                        <ReadonlyField label="Handphone 1" value={formData.nomor_handphone_1 || '-'} />
                        <TextInput label="Handphone 2" value={formData.nomor_handphone_2} onChange={(val) => handleChange('nomor_handphone_2', val)} />
                        <TextInput label="Telepon Rumah 1" value={formData.nomor_telepon_rumah_1} onChange={(val) => handleChange('nomor_telepon_rumah_1', val)} />
                        <TextInput label="Telepon Rumah 2" value={formData.nomor_telepon_rumah_2} onChange={(val) => handleChange('nomor_telepon_rumah_2', val)} />
                    </FormGroup>

                    <FormGroup title="6. Status Pernikahan & Anak">
                        <ComboboxInput
                            label="Status Pernikahan"
                            value={formData.status_pernikahan}
                            onChange={(val) => handleChange('status_pernikahan', val)}
                            options={[{ value: 'Lajang', label: 'Lajang' }, { value: 'Menikah', label: 'Menikah' }, { value: 'Cerai', label: 'Cerai' }]}
                        />
                        <TextInput label="Nama Pasangan" value={formData.nama_pasangan} onChange={(val) => handleChange('nama_pasangan', val)} />
                        <DateInput label="Tanggal Menikah" value={formData.tanggal_menikah} onChange={(val) => handleChange('tanggal_menikah', val)} />
                        <DateInput label="Tanggal Cerai" value={formData.tanggal_cerai} onChange={(val) => handleChange('tanggal_cerai', val)} />
                        <DateInput label="Tanggal Wafat Pasangan" value={formData.tanggal_wafat_pasangan} onChange={(val) => handleChange('tanggal_wafat_pasangan', val)} />
                        <TextInput label="Pekerjaan Pasangan" value={formData.pekerjaan_pasangan} onChange={(val) => handleChange('pekerjaan_pasangan', val)} />
                        <TextInput
                            type="number"
                            label="Jumlah Anak"
                            value={formData.jumlah_anak?.toString()}
                            onChange={(val) => handleJumlahAnakChange(Number(val) || 0)}
                        />
                    </FormGroup>

                    <FormGroup title="7. Rekening Bank">
                        <TextInput label="Nomor Rekening" value={formData.nomor_rekening} onChange={(val) => handleChange('nomor_rekening', val)} />
                        <TextInput label="Nama Pemegang Rekening" value={formData.nama_pemegang_rekening} onChange={(val) => handleChange('nama_pemegang_rekening', val)} />
                        <TextInput label="Nama Bank" value={formData.nama_bank} onChange={(val) => handleChange('nama_bank', val)} />
                        <TextInput label="Cabang Bank" value={formData.cabang_bank} onChange={(val) => handleChange('cabang_bank', val)} />
                    </FormGroup>
                </Tabs.Content>

                {/* TAB 2: Informasi HR */}
                <Tabs.Content value="hr" className="p-6 space-y-8 outline-none focus:ring-0">
                    <FormGroup title="1. Kepegawaian (Read-Only Referensi Head)">
                        <ReadonlyField label="NIK" value={formData.nomor_induk_karyawan} />
                        <ReadonlyField label="Posisi Jabatan ID" value={formData.posisi_jabatan_id} />
                        <TextInput label="Angkatan" value={formData.angkatan} onChange={(val) => handleChange('angkatan', val)} />
                        <ReadonlyField label="Divisi ID" value={formData.divisi_id} />
                        <ReadonlyField label="Department ID" value={formData.department_id} />
                        <TextInput label="Email Perusahaan" type="email" value={formData.email_perusahaan} onChange={(val) => handleChange('email_perusahaan', val)} />

                        <ComboboxInput
                            label="Manager"
                            value={formData.manager_id}
                            onChange={(val) => handleChange('manager_id', val)}
                            options={karyawanOptions}
                            allowClear
                        />
                        <ComboboxInput
                            label="Atasan Langsung"
                            value={formData.atasan_langsung_id}
                            onChange={(val) => handleChange('atasan_langsung_id', val)}
                            options={karyawanOptions}
                            allowClear
                        />
                        <ComboboxInput
                            label="Tag"
                            value={formData.tag_id}
                            onChange={(val) => handleChange('tag_id', val)}
                            options={toOptions(tagList, 'id', 'nama_tag')}
                            allowClear
                        />
                    </FormGroup>

                    <FormGroup title="2. Kontrak">
                        <ComboboxInput
                            label="Jenis Hubungan Kerja"
                            value={formData.jenis_hubungan_kerja_id}
                            onChange={(val) => handleChange('jenis_hubungan_kerja_id', val)}
                            options={toOptions(jhkList, 'id', 'nama_jenis_hubungan_kerja')}
                        />
                        <DateInput label="Tanggal Bergabung" value={formData.tanggal_bergabung} onChange={(val) => handleChange('tanggal_bergabung', val)} />
                        <DateInput label="Tanggal Mulai Kontrak" value={formData.tanggal_mulai_kontrak} onChange={(val) => handleChange('tanggal_mulai_kontrak', val)} />
                        <DateInput label="Tanggal Akhir Kontrak" value={formData.tanggal_akhir_kontrak} onChange={(val) => handleChange('tanggal_akhir_kontrak', val)} />
                        <DateInput label="Tanggal Pengangkatan" value={formData.tanggal_pengangkatan} onChange={(val) => handleChange('tanggal_pengangkatan', val)} />
                        <DateInput label="Tanggal Berhenti" value={formData.tanggal_berhenti} onChange={(val) => handleChange('tanggal_berhenti', val)} />
                        <DateInput label="Tanggal Keluar" value={formData.tanggal_keluar} onChange={(val) => handleChange('tanggal_keluar', val)} />
                    </FormGroup>

                    <FormGroup title="3. Pendidikan">
                        <TextInput label="Tingkat Pendidikan" value={formData.tingkat_pendidikan} onChange={(val) => handleChange('tingkat_pendidikan', val)} />
                        <TextInput label="Bidang Studi" value={formData.bidang_studi} onChange={(val) => handleChange('bidang_studi', val)} />
                        <TextInput label="Nama Sekolah/Universitas" value={formData.nama_sekolah} onChange={(val) => handleChange('nama_sekolah', val)} />
                        <TextInput label="Kota Sekolah" value={formData.kota_sekolah} onChange={(val) => handleChange('kota_sekolah', val)} />
                        <ComboboxInput
                            label="Status Kelulusan"
                            value={formData.status_kelulusan}
                            onChange={(val) => handleChange('status_kelulusan', val)}
                            options={[{ value: 'Lulus', label: 'Lulus' }, { value: 'Belum Lulus', label: 'Belum Lulus' }]}
                        />
                        <div className="md:col-span-2">
                            <TextareaInput label="Keterangan Pendidikan" value={formData.keterangan_pendidikan} onChange={(val) => handleChange('keterangan_pendidikan', val)} />
                        </div>
                    </FormGroup>

                    <FormGroup title="4. Pangkat & Golongan">
                        <ComboboxInput
                            label="Kategori Pangkat"
                            value={formData.kategori_pangkat_id}
                            onChange={(val) => handleChange('kategori_pangkat_id', val)}
                            options={toOptions(kategoriPangkatList, 'id', 'nama_kategori_pangkat')}
                        />
                        <ComboboxInput
                            label="Golongan"
                            value={formData.golongan_id}
                            onChange={(val) => handleChange('golongan_id', val)}
                            options={toOptions(golonganList, 'id', 'nama_golongan')}
                        />
                        <ComboboxInput
                            label="Sub Golongan"
                            value={formData.sub_golongan_id}
                            onChange={(val) => handleChange('sub_golongan_id', val)}
                            options={toOptions(subGolonganList, 'id', 'nama_sub_golongan')}
                        />
                        <TextInput label="No Dana Pensiun" value={formData.no_dana_pensiun} onChange={(val) => handleChange('no_dana_pensiun', val)} />
                    </FormGroup>

                    <FormGroup title="5. Kontak Darurat">
                        <div className="md:col-span-2 space-y-4">
                            <h4 className="font-semibold text-white">Kontak Darurat 1</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Nama Kontak" value={formData.nama_kontak_darurat_1} onChange={(val) => handleChange('nama_kontak_darurat_1', val)} />
                                <TextInput label="Hubungan" value={formData.hubungan_kontak_darurat_1} onChange={(val) => handleChange('hubungan_kontak_darurat_1', val)} />
                                <TextInput label="No Telepon" value={formData.no_telepon_darurat_1} onChange={(val) => handleChange('no_telepon_darurat_1', val)} />
                                <TextInput label="Keterangan" value={formData.keterangan_kontak_darurat_1} onChange={(val) => handleChange('keterangan_kontak_darurat_1', val)} />
                            </div>
                            <h4 className="font-semibold text-white pt-4">Kontak Darurat 2</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Nama Kontak" value={formData.nama_kontak_darurat_2} onChange={(val) => handleChange('nama_kontak_darurat_2', val)} />
                                <TextInput label="Hubungan" value={formData.hubungan_kontak_darurat_2} onChange={(val) => handleChange('hubungan_kontak_darurat_2', val)} />
                                <TextInput label="No Telepon" value={formData.no_telepon_darurat_2} onChange={(val) => handleChange('no_telepon_darurat_2', val)} />
                                <TextInput label="Keterangan" value={formData.keterangan_kontak_darurat_2} onChange={(val) => handleChange('keterangan_kontak_darurat_2', val)} />
                            </div>
                        </div>
                    </FormGroup>

                    <FormGroup title="6. Lain-lain">
                        <TextInput label="POO (Point of Original)" value={formData.point_of_original} onChange={(val) => handleChange('point_of_original', val)} />
                        <TextInput label="POH (Point of Hire)" value={formData.point_of_hire} onChange={(val) => handleChange('point_of_hire', val)} />
                        <TextInput label="Ukuran Seragam" value={formData.ukuran_seragam_kerja} onChange={(val) => handleChange('ukuran_seragam_kerja', val)} />
                        <TextInput label="Ukuran Sepatu" value={formData.ukuran_sepatu_kerja} onChange={(val) => handleChange('ukuran_sepatu_kerja', val)} />
                    </FormGroup>

                    <FormGroup title="7. Pergerakan Karyawan">
                        <ComboboxInput
                            label="Lokasi Sebelumnya"
                            value={formData.lokasi_sebelumnya_id}
                            onChange={(val) => handleChange('lokasi_sebelumnya_id', val)}
                            options={toOptions(lokasiList, 'id', 'nama_lokasi_kerja')}
                        />
                        <DateInput label="Tanggal Mutasi" value={formData.tanggal_mutasi} onChange={(val) => handleChange('tanggal_mutasi', val)} />
                    </FormGroup>

                    <FormGroup title="8. Costing">
                        <TextInput label="Siklus Pembayaran Gaji" value={formData.siklus_pembayaran_gaji} onChange={(val) => handleChange('siklus_pembayaran_gaji', val)} />
                        <TextInput label="Costing" value={formData.costing} onChange={(val) => handleChange('costing', val)} />
                        <TextInput label="Assign" value={formData.assign} onChange={(val) => handleChange('assign', val)} />
                        <TextInput label="Actual" value={formData.actual} onChange={(val) => handleChange('actual', val)} />
                    </FormGroup>
                </Tabs.Content>

                {/* TAB 3: Informasi Keluarga */}
                <Tabs.Content value="keluarga" className="p-6 space-y-8 outline-none focus:ring-0">
                    <FormGroup title="1. Pasangan & Anak">
                        <ReadonlyField label="Nama Pasangan (Diisi dari Biodata)" value={formData.nama_pasangan} />
                        <DateInput label="Tanggal Lahir Pasangan" value={formData.tanggal_lahir_pasangan} onChange={(val) => handleChange('tanggal_lahir_pasangan', val)} />
                        <TextInput label="Pendidikan Terakhir" value={formData.pendidikan_terakhir_pasangan} onChange={(val) => handleChange('pendidikan_terakhir_pasangan', val)} />
                        <TextInput label="Pekerjaan" value={formData.pekerjaan_pasangan} onChange={(val) => handleChange('pekerjaan_pasangan', val)} />
                        <ReadonlyField label="Jumlah Anak" value={formData.jumlah_anak?.toString() || '0'} />
                        <div className="md:col-span-2">
                            <TextareaInput label="Keterangan Pasangan" value={formData.keterangan_pasangan} onChange={(val) => handleChange('keterangan_pasangan', val)} />
                        </div>
                    </FormGroup>

                    {/* Identitas Anak */}
                    {(formData.anak || []).length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">2. Identitas Anak</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {(formData.anak || []).map((anak, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                                        <h4 className="text-sm font-medium text-indigo-300 mb-3">Anak Ke-{i + 1}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <TextInput
                                                label="Nama Anak"
                                                value={anak.nama_anak}
                                                onChange={(val) => handleArrayChange('anak', i, 'nama_anak', val)}
                                            />
                                            <ComboboxInput
                                                label="Jenis Kelamin"
                                                value={anak.jenis_kelamin}
                                                onChange={(val) => handleArrayChange('anak', i, 'jenis_kelamin', val)}
                                                options={[{ value: 'Laki-Laki', label: 'Laki-Laki' }, { value: 'Perempuan', label: 'Perempuan' }]}
                                            />
                                            <DateInput
                                                label="Tanggal Lahir"
                                                value={anak.tanggal_lahir}
                                                onChange={(val) => handleArrayChange('anak', i, 'tanggal_lahir', val)}
                                            />
                                            <TextInput
                                                label="Keterangan"
                                                value={anak.keterangan}
                                                onChange={(val) => handleArrayChange('anak', i, 'keterangan', val)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <FormGroup title="3. Orang Tua Kandung">
                        <div className="md:col-span-2 space-y-4">
                            <h4 className="font-semibold text-white">Ayah Kandung</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Nama Ayah" value={formData.nama_ayah_kandung} onChange={(val) => handleChange('nama_ayah_kandung', val)} />
                                <DateInput label="Tanggal Lahir" value={formData.tanggal_lahir_ayah_kandung} onChange={(val) => handleChange('tanggal_lahir_ayah_kandung', val)} />
                                <TextInput label="Pendidikan Terakhir" value={formData.pendidikan_terakhir_ayah} onChange={(val) => handleChange('pendidikan_terakhir_ayah', val)} />
                                <TextInput label="Pekerjaan" value={formData.pekerjaan_ayah} onChange={(val) => handleChange('pekerjaan_ayah', val)} />
                            </div>
                            <h4 className="font-semibold text-white pt-4">Ibu Kandung</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Nama Ibu" value={formData.nama_ibu_kandung} onChange={(val) => handleChange('nama_ibu_kandung', val)} />
                                <DateInput label="Tanggal Lahir" value={formData.tanggal_lahir_ibu_kandung} onChange={(val) => handleChange('tanggal_lahir_ibu_kandung', val)} />
                                <TextInput label="Pendidikan Terakhir" value={formData.pendidikan_terakhir_ibu} onChange={(val) => handleChange('pendidikan_terakhir_ibu', val)} />
                                <TextInput label="Pekerjaan" value={formData.pekerjaan_ibu} onChange={(val) => handleChange('pekerjaan_ibu', val)} />
                            </div>
                        </div>
                    </FormGroup>

                    {/* Saudara Kandung */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h3 className="text-lg font-semibold text-white">4. Saudara Kandung</h3>
                            <button
                                type="button"
                                onClick={handleAddSaudara}
                                disabled={(formData.saudara_kandung || []).length >= 5}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" /> Tambah Saudara
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                type="number"
                                label="Anak Ke"
                                value={formData.anak_ke?.toString() || ''}
                                onChange={(val) => handleChange('anak_ke', Number(val) || undefined)}
                            />
                            <ReadonlyField label="Jumlah Saudara" value={(formData.saudara_kandung || []).length.toString()} />
                        </div>

                        {(formData.saudara_kandung || []).map((saudara, i) => (
                            <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] relative group">
                                <button
                                    onClick={() => handleRemoveSaudara(i)}
                                    className="absolute top-4 right-4 p-2 rounded-lg text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <h4 className="text-sm font-medium text-indigo-300 mb-3">Saudara Ke-{i + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                                    <TextInput
                                        label="Nama Lengkap"
                                        value={saudara.nama_saudara_kandung}
                                        onChange={(val) => handleArrayChange('saudara_kandung', i, 'nama_saudara_kandung', val)}
                                    />
                                    <ComboboxInput
                                        label="Jenis Kelamin"
                                        value={saudara.jenis_kelamin}
                                        onChange={(val) => handleArrayChange('saudara_kandung', i, 'jenis_kelamin', val)}
                                        options={[{ value: 'Laki-Laki', label: 'Laki-Laki' }, { value: 'Perempuan', label: 'Perempuan' }]}
                                    />
                                    <DateInput
                                        label="Tanggal Lahir"
                                        value={saudara.tanggal_lahir}
                                        onChange={(val) => handleArrayChange('saudara_kandung', i, 'tanggal_lahir', val)}
                                    />
                                    <TextInput
                                        label="Pendidikan Terakhir"
                                        value={saudara.pendidikan_terakhir}
                                        onChange={(val) => handleArrayChange('saudara_kandung', i, 'pendidikan_terakhir', val)}
                                    />
                                    <TextInput
                                        label="Pekerjaan"
                                        value={saudara.pekerjaan}
                                        onChange={(val) => handleArrayChange('saudara_kandung', i, 'pekerjaan', val)}
                                    />
                                    <TextInput
                                        label="Keterangan"
                                        value={saudara.keterangan}
                                        onChange={(val) => handleArrayChange('saudara_kandung', i, 'keterangan', val)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <FormGroup title="5. Orang Tua Mertua">
                        <div className="md:col-span-2 space-y-4">
                            <h4 className="font-semibold text-white">Ayah Mertua</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Nama Ayah" value={formData.nama_ayah_mertua} onChange={(val) => handleChange('nama_ayah_mertua', val)} />
                                <DateInput label="Tanggal Lahir" value={formData.tanggal_lahir_ayah_mertua} onChange={(val) => handleChange('tanggal_lahir_ayah_mertua', val)} />
                                <TextInput label="Pendidikan Terakhir" value={formData.pendidikan_terakhir_ayah_mertua} onChange={(val) => handleChange('pendidikan_terakhir_ayah_mertua', val)} />
                                <TextInput label="Pekerjaan" value={formData.pekerjaan_ayah_mertua} onChange={(val) => handleChange('pekerjaan_ayah_mertua', val)} />
                            </div>
                            <h4 className="font-semibold text-white pt-4">Ibu Mertua</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextInput label="Nama Ibu" value={formData.nama_ibu_mertua} onChange={(val) => handleChange('nama_ibu_mertua', val)} />
                                <DateInput label="Tanggal Lahir" value={formData.tanggal_lahir_ibu_mertua} onChange={(val) => handleChange('tanggal_lahir_ibu_mertua', val)} />
                                <TextInput label="Pendidikan Terakhir" value={formData.pendidikan_terakhir_ibu_mertua} onChange={(val) => handleChange('pendidikan_terakhir_ibu_mertua', val)} />
                                <TextInput label="Pekerjaan" value={formData.pekerjaan_ibu_mertua} onChange={(val) => handleChange('pekerjaan_ibu_mertua', val)} />
                            </div>
                        </div>
                    </FormGroup>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}

// --- Helper Components ---

function FormGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

function TextInput({ label, value = '', onChange, placeholder, type = 'text' }: {
    label: string; value: string | undefined; onChange: (val: string) => void; placeholder?: string; type?: string
}) {
    return (
        <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
            <label className="text-xs font-medium text-neutral-400 transition-colors uppercase tracking-wider">{label}</label>
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all duration-200"
            />
        </div>
    );
}

function TextareaInput({ label, value = '', onChange, placeholder }: {
    label: string; value: string | undefined; onChange: (val: string) => void; placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
            <label className="text-xs font-medium text-neutral-400 transition-colors uppercase tracking-wider">{label}</label>
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all duration-200 min-h-[100px] resize-y"
            />
        </div>
    );
}

function DateInput({ label, value = '', onChange }: {
    label: string; value: string | undefined; onChange: (val: string) => void;
}) {
    // extract just YYYY-MM-DD for consistency
    const displayValue = value ? value.split('T')[0] : '';

    return (
        <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
            <label className="text-xs font-medium text-neutral-400 transition-colors uppercase tracking-wider">{label}</label>
            <input
                type="date"
                value={displayValue}
                onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all duration-200 text-white"
            />
        </div>
    );
}

function ComboboxInput({ label, value = '', onChange, options, allowClear = false }: {
    label: string; value: string | undefined; onChange: (val: string) => void; options: { value: string; label: string }[], allowClear?: boolean
}) {
    return (
        <div className="flex flex-col gap-1.5 focus-within:text-indigo-400">
            <label className="text-xs font-medium text-neutral-400 transition-colors uppercase tracking-wider">{label}</label>
            <Combobox
                options={options}
                value={value || ''}
                onChange={onChange}
                allowClear={allowClear}
            />
        </div>
    );
}

function ReadonlyField({ label, value }: { label: string; value: string | undefined | null }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{label}</label>
            <div className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-transparent text-sm text-neutral-500">
                {value || '-'}
            </div>
        </div>
    );
}
