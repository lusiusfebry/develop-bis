import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Database,
    Users,
    FileSpreadsheet,
    Building2,
    Layers,
    Briefcase,
    Award,
    Shield,
    GitBranch,
    Tags,
    MapPin,
    UserCheck,
    LayoutDashboard,
    Network,
} from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const masterDataItems: NavItem[] = [
    { label: 'Divisi', href: '/hr/master/divisi', icon: Building2 },
    { label: 'Department', href: '/hr/master/department', icon: Network },
    { label: 'Posisi Jabatan', href: '/hr/master/posisi-jabatan', icon: Briefcase },
    { label: 'Kategori Pangkat', href: '/hr/master/kategori-pangkat', icon: Award },
    { label: 'Golongan', href: '/hr/master/golongan', icon: Layers },
    { label: 'Sub Golongan', href: '/hr/master/sub-golongan', icon: GitBranch },
    { label: 'Jenis Hubungan Kerja', href: '/hr/master/jenis-hubungan-kerja', icon: Shield },
    { label: 'Tag', href: '/hr/master/tag', icon: Tags },
    { label: 'Lokasi Kerja', href: '/hr/master/lokasi-kerja', icon: MapPin },
    { label: 'Status Karyawan', href: '/hr/master/status-karyawan', icon: UserCheck },
];

export default function HRSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMasterOpen, setIsMasterOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (href: string) => location.pathname === href;
    const isMasterActive = location.pathname.startsWith('/hr/master');

    return (
        <aside
            className={`relative flex flex-col h-screen bg-[#0a0a0f]/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 shrink-0 ${isCollapsed ? 'w-16' : 'w-60'
                }`}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    B
                </div>
                {!isCollapsed && (
                    <span className="text-sm font-semibold text-white tracking-wide">BIS HR</span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {/* Dashboard */}
                <button
                    onClick={() => navigate('/')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${location.pathname === '/'
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Dashboard</span>}
                </button>

                {/* Master Data Group */}
                <div className="pt-2">
                    <button
                        onClick={() => {
                            if (isCollapsed) {
                                setIsCollapsed(false);
                                setIsMasterOpen(true);
                            } else {
                                setIsMasterOpen(!isMasterOpen);
                            }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${isMasterActive
                                ? 'bg-indigo-500/10 text-indigo-300'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Database className="w-4 h-4 shrink-0" />
                        {!isCollapsed && (
                            <>
                                <span className="flex-1 text-left">Master Data</span>
                                <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isMasterOpen ? 'rotate-0' : '-rotate-90'
                                        }`}
                                />
                            </>
                        )}
                    </button>

                    {!isCollapsed && isMasterOpen && (
                        <div className="mt-1 ml-3 pl-3 border-l border-white/5 space-y-0.5">
                            {masterDataItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => navigate(item.href)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${isActive(item.href)
                                                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Karyawan */}
                <button
                    onClick={() => navigate('/hr/karyawan')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${location.pathname.startsWith('/hr/karyawan')
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                >
                    <Users className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Karyawan</span>}
                </button>

                {/* Import/Export */}
                <button
                    onClick={() => navigate('/hr/import-export')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${location.pathname.startsWith('/hr/import-export')
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                >
                    <FileSpreadsheet className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Import / Export</span>}
                </button>
            </nav>

            {/* Collapse Toggle */}
            <div className="p-2 border-t border-white/5 shrink-0">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs">Sembunyikan</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
