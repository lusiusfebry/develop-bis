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
        <div className="min-h-screen bg-background text-foreground animate-fade-in relative z-0">
            {/* Ambient Background untuk light/dark mode */}
            <div className="absolute inset-0 bg-[url('/mining-bg.png')] opacity-[0.05] dark:opacity-[0.03] mix-blend-multiply dark:mix-blend-overlay pointer-events-none z-0 bg-cover bg-center"></div>

            {/* Header */}
            <header className="border-b border-border/50 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {getGreeting()},{' '}
                            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                                {displayName}
                            </span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1 tracking-wide">{formatDate()}</p>
                    </div>
                    <button
                        id="btn-logout"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50 border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border/80 transition-all duration-200 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm font-medium">Keluar</span>
                    </button>
                </div>
            </header>

            {/* Bento Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
                    {/* Kartu Profil Singkat */}
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 hover:border-border transition-all duration-200 shadow-sm group">
                        <div className="flex items-center gap-4">
                            {user?.karyawan?.foto_karyawan ? (
                                <img
                                    src={user.karyawan.foto_karyawan}
                                    alt="Foto profil"
                                    className="w-14 h-14 rounded-xl object-cover border border-border/50 shadow-sm"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-lg font-bold text-white shadow-md">
                                    {getInitials(displayName)}
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-semibold text-foreground truncate tracking-wide">
                                    {displayName}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate font-medium">
                                    {user?.karyawan?.nomor_induk_karyawan || user?.nik}
                                </p>
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-500/20 font-semibold tracking-wider">
                                    {user?.role || 'User'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Total Karyawan Aktif */}
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 hover:border-border transition-all duration-200 shadow-sm group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-2 font-medium">Karyawan Aktif</p>
                                {statsLoading ? (
                                    <div className="w-20 h-9 rounded-lg bg-muted animate-pulse" />
                                ) : (
                                    <p className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                                        {stats?.total ?? '-'}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2 tracking-wide">Total terdaftar</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-6 h-6 text-indigo-500" />
                            </div>
                        </div>
                    </div>

                    {/* Shortcut HR — row-span-2 */}
                    <div className="md:row-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 hover:border-border transition-all duration-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 tracking-widest uppercase relative z-10">
                            Menu Cepat HR
                        </h3>
                        <div className="space-y-3 relative z-10 flex flex-col justify-center h-[calc(100%-2rem)]">
                            {shortcuts.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => navigate(item.href)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl bg-accent/50 border border-border hover:border-border/80 hover:bg-accent transition-all duration-200 group/btn cursor-pointer`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 border border-white/10 shadow-sm group-hover/btn:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground group-hover/btn:text-foreground transition-colors text-left tracking-wide">
                                            {item.label}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover/btn:text-foreground ml-auto transition-all duration-300 group-hover/btn:translate-x-1" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selamat Datang — col-span-2 */}
                    <div className="md:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 hover:border-border transition-all duration-200 relative overflow-hidden shadow-sm">
                        {/* Decorative gradient */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
                        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/10 rounded-full blur-[50px]" />

                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold text-foreground mb-2 tracking-wide">
                                Selamat Datang di Sistem Informasi Bebang
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Bebang Sistem Informasi (BIS) untuk PT Prima Sarana Gemilang Site Taliabu adalah platform manajemen terpadu
                                yang dirancang untuk mempermudah pengelolaan data karyawan,
                                master data organisasi, serta sinkronisasi aset lainnya. Gunakan
                                menu navigasi untuk mengakses fitur operasional yang tersedia.
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2.5 text-xs font-medium text-muted-foreground bg-accent/50 px-4 py-2 rounded-full border border-border">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                Sistem berjalan normal
                                <span className="mx-2 opacity-50">|</span>
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                                Koneksi Aman
                            </div>
                        </div>
                    </div>

                    {/* Modul Lain — col-span-3 */}
                    <div className="md:col-span-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm hover:bg-card/80 hover:border-border transition-all duration-200 mt-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-widest">
                            Modul Lainnya
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {upcomingModules.map((mod) => {
                                const Icon = mod.icon;
                                return (
                                    <div
                                        key={mod.label}
                                        className="flex flex-col items-center gap-3 p-5 rounded-xl bg-accent/30 border border-border/50 opacity-60 hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground tracking-wide">{mod.label}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold tracking-wider">
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
