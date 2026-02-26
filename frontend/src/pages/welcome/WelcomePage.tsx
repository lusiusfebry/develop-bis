import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    LogOut,
    Users,
    UserCog,
    Database,
    FileSpreadsheet,
    Package,
    Building2,
    Home,
    ShieldCheck,
    ArrowRight,
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { karyawanService } from '@/services/karyawan.service';

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(): string {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const shortcuts = [
    {
        label: 'Manajemen Karyawan',
        href: '/hr/karyawan',
        icon: UserCog,
        color: 'from-indigo-500/50 to-violet-500/50',
    },
    {
        label: 'Master Data',
        href: '/hr/master',
        icon: Database,
        color: 'from-violet-500/50 to-purple-500/50',
    },
    {
        label: 'Import / Export',
        href: '/hr/import-export',
        icon: FileSpreadsheet,
        color: 'from-cyan-500/50 to-blue-500/50',
    },
];

const upcomingModules = [
    { label: 'Inventory', icon: Package },
    { label: 'Mess', icon: Home },
    { label: 'Building', icon: Building2 },
    { label: 'User Access', icon: ShieldCheck },
];

export default function WelcomePage() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['karyawan-stats'],
        queryFn: () => karyawanService.getKaryawanStats(),
    });

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const displayName =
        user?.karyawan?.nama_lengkap || user?.nik || 'Pengguna';

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {getGreeting()},{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                {displayName}
                            </span>
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">{formatDate()}</p>
                    </div>
                    <button
                        id="btn-logout"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm">Keluar</span>
                    </button>
                </div>
            </header>

            {/* Bento Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
                    {/* Kartu Profil Singkat */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200">
                        <div className="flex items-center gap-4">
                            {user?.karyawan?.foto_karyawan ? (
                                <img
                                    src={user.karyawan.foto_karyawan}
                                    alt="Foto profil"
                                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-lg font-bold text-white">
                                    {getInitials(displayName)}
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-semibold text-white truncate">
                                    {displayName}
                                </h3>
                                <p className="text-sm text-neutral-400 truncate">
                                    {user?.karyawan?.nomor_induk_karyawan || user?.nik}
                                </p>
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {user?.role || 'User'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Total Karyawan Aktif */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-2">Karyawan Aktif</p>
                                {statsLoading ? (
                                    <div className="w-20 h-9 rounded-lg bg-white/10 animate-pulse" />
                                ) : (
                                    <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                        {stats?.total ?? '-'}
                                    </p>
                                )}
                                <p className="text-xs text-neutral-500 mt-2">Total terdaftar</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                                <Users className="w-6 h-6 text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    {/* Shortcut HR — row-span-2 */}
                    <div className="md:row-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200">
                        <h3 className="text-sm font-medium text-neutral-400 mb-4">
                            Menu Cepat HR
                        </h3>
                        <div className="space-y-3">
                            {shortcuts.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => navigate(item.href)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-transparent hover:border-indigo-500/30 hover:bg-white/[0.08] transition-all duration-200 group cursor-pointer`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}
                                        >
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors text-left">
                                            {item.label}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 ml-auto transition-colors" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selamat Datang — col-span-2 */}
                    <div className="md:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
                        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-violet-500/10 rounded-full blur-[50px]" />

                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Selamat Datang di BIS
                            </h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Bebang Sistem Informasi (BIS) adalah platform manajemen terpadu
                                yang dirancang untuk mempermudah pengelolaan data karyawan,
                                master data organisasi, serta modul operasional lainnya. Gunakan
                                menu di samping untuk mengakses fitur HR yang tersedia.
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 text-xs text-neutral-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Sistem berjalan normal
                            </div>
                        </div>
                    </div>

                    {/* Modul Lain — col-span-3 */}
                    <div className="md:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-neutral-400 mb-4">
                            Modul Lainnya
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {upcomingModules.map((mod) => {
                                const Icon = mod.icon;
                                return (
                                    <div
                                        key={mod.label}
                                        className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.03] border border-white/5 opacity-60"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-neutral-500" />
                                        </div>
                                        <span className="text-sm text-neutral-500">{mod.label}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            Segera Hadir
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
