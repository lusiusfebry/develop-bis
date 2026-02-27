import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';

const NIK_REGEX = /^\d{2}-\d{5}$/;

function formatNik(value: string): string {
    const digits = value.replace(/[^0-9]/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 7)}`;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [nik, setNik] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nikTouched, setNikTouched] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isNikValid = NIK_REGEX.test(nik);
    const isFormValid = isNikValid && password.length > 0;

    const loginMutation = useMutation({
        mutationFn: () => authService.login(nik, password),
        onSuccess: () => {
            navigate('/');
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { message?: string } } };
            setErrorMessage(
                err.response?.data?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.'
            );
        },
    });

    const handleNikChange = (value: string) => {
        const formatted = formatNik(value);
        setNik(formatted);
        setErrorMessage(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid || loginMutation.isPending) return;
        setErrorMessage(null);
        loginMutation.mutate();
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-slate-950 font-sans overflow-y-auto">
            {/* Background Image layers */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/mining-bg.png"
                    alt="Mining Site"
                    className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                {/* Overlay gradient: Navy to Dark Amber centered vignette */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128]/95 via-[#0a1128]/70 to-[#0a1128]/95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,133,0,0.1)_0%,transparent_70%)]" />
            </div>

            {/* Container Utama - z-index 10 di atas background */}
            <div className="relative z-10 w-full max-w-[500px] flex flex-col items-center animate-[fadeIn_1s_ease-out]">

                {/* Header: Logo dan Nama Perusahaan */}
                <div className="w-full flex justify-center items-center gap-4 sm:gap-6 mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 shrink-0">
                        <img
                            src="/logo-psg.jpg"
                            alt="PT Prima Sarana Gemilang Logo"
                            className="h-16 w-auto object-contain rounded-lg"
                        />
                    </div>
                    <div className="text-left">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                            PT Prima Sarana Gemilang
                        </h1>
                        <p className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 mt-0.5">
                            Site Taliabu
                        </p>
                    </div>
                </div>

                {/* Card Form Login */}
                <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 sm:p-10 transition-all duration-500 hover:bg-white/15 animate-[slideInUp_0.8s_ease-out]">

                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
                            Sistem Informasi Bebang
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed font-light">
                            Platform terpadu untuk efisiensi manajemen data karyawan, pencatatan waktu kerja, pengelolaan aset operasional, dan pelaporan site perusahaan secara real-time.
                        </p>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

                    <div className="mb-8 text-center">
                        <h3 className="text-xl font-bold text-white mb-1 tracking-tight">Login Portal</h3>
                        <p className="text-sm text-slate-400">
                            Masukkan NIK dan kata sandi Anda
                        </p>
                    </div>

                    {/* Error Alert */}
                    {errorMessage && (
                        <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm animate-[shake_0.5s_ease-in-out]">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Field NIK */}
                        <div className="group">
                            <label
                                htmlFor="nik"
                                className="block text-sm font-medium text-slate-300 mb-2 transition-colors group-hover:text-amber-400"
                            >
                                Nomor Induk Karyawan
                            </label>
                            <input
                                id="nik"
                                type="text"
                                value={nik}
                                onChange={(e) => handleNikChange(e.target.value)}
                                onBlur={() => setNikTouched(true)}
                                placeholder="XX-XXXXX"
                                maxLength={8}
                                autoComplete="username"
                                className={`w-full px-5 py-4 bg-[#0a1128]/50 border rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 hover:bg-[#0a1128]/70 ${nikTouched && !isNikValid && nik.length > 0
                                        ? 'border-red-500/50 focus:ring-red-500/30'
                                        : 'border-white/10 focus:ring-amber-500/40 focus:border-amber-500/50'
                                    }`}
                            />
                            {nikTouched && !isNikValid && nik.length > 0 && (
                                <p className="mt-2 text-xs text-red-400 animate-[fadeIn_0.3s_ease-out]">
                                    Format NIK tidak valid. Gunakan format XX-XXXXX
                                </p>
                            )}
                        </div>

                        {/* Field Password */}
                        <div className="group">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300 mb-2 transition-colors group-hover:text-amber-400"
                            >
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorMessage(null);
                                    }}
                                    placeholder="Masukkan kata sandi"
                                    autoComplete="current-password"
                                    className="w-full px-5 py-4 pr-12 bg-[#0a1128]/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all duration-300 hover:bg-[#0a1128]/70"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tombol Login */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={!isFormValid || loginMutation.isPending}
                                className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 overflow-hidden relative group cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loginMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Mengautentikasi...</span>
                                        </>
                                    ) : (
                                        'Masuk ke Sistem'
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>

                </div>

                {/* Footer */}
                <div className="mt-12 text-center opacity-70">
                    <p className="text-sm text-slate-300">
                        &copy; {new Date().getFullYear()} PT Prima Sarana Gemilang. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Bebang Sistem Informasi v1.0
                    </p>
                </div>
            </div>

            {/* Custom Keyframes for Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}
