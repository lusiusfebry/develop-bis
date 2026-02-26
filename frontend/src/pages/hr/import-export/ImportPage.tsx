import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { importExportService } from '../../../services/import-export.service';
import type { ImportPreviewResult, ImportExecuteResult } from '../../../types/import-export.types';

export default function ImportPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ImportPreviewResult | null>(null);
    const [executeResult, setExecuteResult] = useState<ImportExecuteResult | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const previewMutation = useMutation({
        mutationFn: (f: File) => importExportService.previewImport(f),
        onSuccess: (data) => {
            setPreviewData(data);
            setStep(2);
        },
        onError: (error) => {
            console.error('Preview error:', error);
            alert('Gagal membaca file atau format tidak sesuai.');
        }
    });

    const executeMutation = useMutation({
        mutationFn: (f: File) => importExportService.executeImport(f),
        onSuccess: (data) => {
            setExecuteResult(data);
        },
        onError: (error) => {
            console.error('Execute error:', error);
            alert('Gagal mengeksekusi import data.');
        }
    });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
            setFile(droppedFile);
        } else {
            alert('Hanya file .xlsx yang diperbolehkan');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
        } else if (selectedFile) {
            alert('Hanya file .xlsx yang diperbolehkan');
        }
    };

    const handlePreview = () => {
        if (file) {
            previewMutation.mutate(file);
        }
    };

    const handleExecute = () => {
        if (file && previewData && previewData.summary.valid > 0) {
            setStep(3);
            executeMutation.mutate(file);
        }
    };

    const handleReset = () => {
        setStep(1);
        setFile(null);
        setPreviewData(null);
        setExecuteResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Import Data Karyawan</h1>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center space-x-4 mb-8">
                <div className={`flex items-center ${step >= 1 ? 'text-indigo-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? (step > 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'border-indigo-500 font-bold') : 'border-gray-500'}`}>
                        {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                    </div>
                    <span className="ml-2 font-medium">Upload File</span>
                </div>
                <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-700'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-indigo-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? (step > 2 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'border-indigo-500 font-bold') : 'border-gray-500'}`}>
                        {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                    </div>
                    <span className="ml-2 font-medium">Preview Data</span>
                </div>
                <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-indigo-500' : 'bg-gray-700'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-indigo-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-indigo-500 font-bold' : 'border-gray-500'}`}>
                        3
                    </div>
                    <span className="ml-2 font-medium">Hasil</span>
                </div>
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
                <div className="bg-[#13131a] rounded-xl border border-white/5 p-6 space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => importExportService.downloadTemplate()}
                            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Template BMI</span>
                        </button>
                    </div>

                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-white/20 hover:border-indigo-500/50 rounded-xl p-12 flex flex-col items-center justify-center bg-white/5 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".xlsx"
                            className="hidden"
                        />

                        {file ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-4 bg-indigo-500/20 rounded-full">
                                    <FileSpreadsheet className="w-10 h-10 text-indigo-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-white">{file.name}</p>
                                    <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-4 bg-white/10 rounded-full">
                                    <Upload className="w-10 h-10 text-gray-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-white mb-1">Klik atau drag file Excel ke sini</p>
                                    <p className="text-sm text-gray-400">Hanya format .xlsx yang didukung</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handlePreview}
                            disabled={!file || previewMutation.isPending}
                            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 font-medium transition-colors"
                        >
                            {previewMutation.isPending ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span>Lanjut Preview</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Preview */}
            {step === 2 && previewData && (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#13131a] p-4 rounded-xl border border-white/5 flex items-center space-x-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Baris</p>
                                <p className="text-2xl font-bold text-white">{previewData.summary.total}</p>
                            </div>
                        </div>
                        <div className="bg-[#13131a] p-4 rounded-xl border border-white/5 flex items-center space-x-4">
                            <div className="p-3 bg-emerald-500/20 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Baris Valid</p>
                                <p className="text-2xl font-bold text-emerald-400">{previewData.summary.valid}</p>
                            </div>
                        </div>
                        <div className="bg-[#13131a] p-4 rounded-xl border border-white/5 flex items-center space-x-4">
                            <div className="p-3 bg-red-500/20 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Baris Tidak Valid</p>
                                <p className="text-2xl font-bold text-red-400">{previewData.summary.invalid}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#13131a] rounded-xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-white/5 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">NIK</th>
                                        <th className="px-4 py-3">Nama Lengkap</th>
                                        <th className="px-4 py-3">Divisi</th>
                                        <th className="px-4 py-3">Department</th>
                                        <th className="px-4 py-3">Status Validasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {previewData.rows.map((row) => (
                                        <tr
                                            key={row.rowNumber}
                                            className={`hover:bg-white/5 ${!row.isValid ? 'bg-red-500/5' : row.warnings.length > 0 ? 'bg-amber-500/5' : ''}`}
                                        >
                                            <td className="px-4 py-3 border-l-2 border-transparent" style={{ borderColor: !row.isValid ? '#ef4444' : row.warnings.length > 0 ? '#f59e0b' : 'transparent' }}>
                                                {row.rowNumber}
                                            </td>
                                            <td className="px-4 py-3">{row.nomor_induk_karyawan || '-'}</td>
                                            <td className="px-4 py-3 font-medium text-white">{row.nama_lengkap || '-'}</td>
                                            <td className="px-4 py-3">{row.divisi || '-'}</td>
                                            <td className="px-4 py-3">{row.department || '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col space-y-1">
                                                    {!row.isValid ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                                                            Error
                                                        </span>
                                                    ) : row.warnings.length > 0 ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400">
                                                            Warning
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                                            Valid
                                                        </span>
                                                    )}

                                                    {(row.errors.length > 0 || row.warnings.length > 0) && (
                                                        <div className="text-xs mt-1">
                                                            {row.errors.map((e, idx) => (
                                                                <div key={idx} className="text-red-400 truncate max-w-[200px]" title={e}>• {e}</div>
                                                            ))}
                                                            {row.warnings.map((w, idx) => (
                                                                <div key={idx} className="text-amber-400 truncate max-w-[200px]" title={w}>• {w}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center space-x-2 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Kembali</span>
                        </button>
                        <button
                            onClick={handleExecute}
                            disabled={previewData.summary.valid === 0}
                            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 font-medium transition-colors"
                        >
                            <span>Eksekusi Import</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Result */}
            {step === 3 && (
                <div className="space-y-6">
                    {executeMutation.isPending ? (
                        <div className="bg-[#13131a] rounded-xl border border-white/5 p-12 flex flex-col items-center justify-center space-y-4">
                            <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
                            <p className="text-lg font-medium text-white">Sedang Memproses Data...</p>
                            <p className="text-gray-400">Mohon tunggu sebentar, jangan tutup halaman ini.</p>
                        </div>
                    ) : executeResult ? (
                        <div className="space-y-6">
                            <div className="bg-[#13131a] rounded-xl border border-white/5 p-6">
                                <div className="text-center mb-8">
                                    <div className="inline-flex p-4 bg-emerald-500/20 rounded-full mb-4">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Import Selesai</h2>
                                    <p className="text-gray-400">Proses import data karyawan telah selesai dieksekusi.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                        <p className="text-sm text-gray-400 mb-1">Berhasil Ditambahkan</p>
                                        <p className="text-3xl font-bold text-emerald-400">{executeResult.berhasil}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                        <p className="text-sm text-gray-400 mb-1">Berhasil Diperbarui</p>
                                        <p className="text-3xl font-bold text-indigo-400">{executeResult.diperbarui}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                        <p className="text-sm text-gray-400 mb-1">Gagal Diproses</p>
                                        <p className="text-3xl font-bold text-red-400">{executeResult.gagal}</p>
                                    </div>
                                </div>

                                {executeResult.errors && executeResult.errors.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                                            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                            Detail Error
                                        </h3>
                                        <div className="bg-red-500/5 rounded-xl border border-red-500/10 overflow-hidden">
                                            <table className="w-full text-left text-sm text-gray-300">
                                                <thead className="text-xs text-red-400 uppercase bg-red-500/10">
                                                    <tr>
                                                        <th className="px-4 py-3 w-20">Baris</th>
                                                        <th className="px-4 py-3 w-32">NIK</th>
                                                        <th className="px-4 py-3">Pesan Error</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-red-500/10">
                                                    {executeResult.errors.map((err, idx) => (
                                                        <tr key={idx} className="hover:bg-red-500/10">
                                                            <td className="px-4 py-3 font-medium">{err.rowNumber}</td>
                                                            <td className="px-4 py-3">{err.nik || '-'}</td>
                                                            <td className="px-4 py-3 text-red-400">{err.pesan}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center space-x-2 font-medium transition-colors"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        <span>Import Baru</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#13131a] rounded-xl border border-white/5 p-12 flex flex-col items-center justify-center space-y-4">
                            <XCircle className="w-12 h-12 text-red-500" />
                            <p className="text-lg font-medium text-white">Terjadi Kesalahan</p>
                            <button onClick={handleReset} className="px-4 py-2 mt-4 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                                Coba Lagi
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
