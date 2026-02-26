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
        <div className="min-h-screen flex">
            {/* Sisi Kiri — Branding */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-indigo-950 via-violet-950 to-cyan-950">
                {/* Grid Pattern Dekoratif */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-cyan-500/15 rounded-full blur-[80px]" />

                {/* Konten Branding */}
                <div className="relative z-10 text-center px-12 max-w-lg">
                    {/* Logo */}
                    <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                        <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            BIS
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                        Bebang Sistem Informasi
                    </h1>
                    <p className="text-lg text-indigo-200/70 leading-relaxed">
                        Platform manajemen terpadu untuk pengelolaan data karyawan, aset,
                        dan operasional perusahaan.
                    </p>

                    {/* Decorative Line */}
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-indigo-400/50" />
                        <div className="w-2 h-2 rounded-full bg-indigo-400/50" />
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-violet-400/50" />
                    </div>
                </div>
            </div>

            {/* Sisi Kanan — Form Login */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0a0a0f] p-6 sm:p-10">
                <div className="w-full max-w-md">
                    {/* Mobile Brand */}
                    <div className="md:hidden text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                BIS
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Bebang Sistem Informasi</h1>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-1">Masuk</h2>
                            <p className="text-sm text-neutral-400">
                                Masukkan kredensial Anda untuk melanjutkan
                            </p>
                        </div>

                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Field NIK */}
                            <div>
                                <label
                                    htmlFor="nik"
                                    className="block text-sm font-medium text-neutral-300 mb-2"
                                >
                                    Nomor Induk Karyawan
                                </label>
                                <input
                                    id="nik"
                                    type="text"
                                    value={nik}
                                    onChange={(e) => handleNikChange(e.target.value)}
                                    onBlur={() => setNikTouched(true)}
                                    placeholder="xx-xxxxx"
                                    maxLength={8}
                                    autoComplete="username"
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all duration-200 ${nikTouched && !isNikValid && nik.length > 0
                                            ? 'border-red-500/50 focus:ring-red-500/30'
                                            : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'
                                        }`}
                                />
                                {nikTouched && !isNikValid && nik.length > 0 && (
                                    <p className="mt-2 text-xs text-red-400">
                                        Format NIK tidak valid. Gunakan format XX-XXXXX
                                    </p>
                                )}
                            </div>

                            {/* Field Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-neutral-300 mb-2"
                                >
                                    Password
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
                                        placeholder="Masukkan password"
                                        autoComplete="current-password"
                                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
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
                            <button
                                type="submit"
                                disabled={!isFormValid || loginMutation.isPending}
                                className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 cursor-pointer bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-neutral-600">
                        &copy; {new Date().getFullYear()} Bebang Sistem Informasi. Seluruh hak dilindungi.
                    </p>
                </div>
            </div>
        </div>
    );
}
