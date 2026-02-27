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
    Upload,
    Download,
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

const importExportItems: NavItem[] = [
    { label: 'Import Data', href: '/hr/import-export/import', icon: Upload },
    { label: 'Export Data', href: '/hr/import-export/export', icon: Download },
];

const manajemenKaryawanItems: NavItem[] = [
    { label: 'Data Karyawan', href: '/hr/karyawan', icon: Users },
];

export default function HRSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMasterOpen, setIsMasterOpen] = useState(true);
    const [isKaryawanOpen, setIsKaryawanOpen] = useState(true);
    const [isImportExportOpen, setIsImportExportOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (href: string) => location.pathname === href;
    const isMasterActive = location.pathname.startsWith('/hr/master');
    const isKaryawanGroupActive = location.pathname.startsWith('/hr/karyawan');

    return (
        <aside
            className={`relative flex flex-col h-screen bg-card/50 backdrop-blur-2xl border-r border-border/50 text-foreground z-30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.1)] ${isCollapsed ? 'w-[80px]' : 'w-[280px]'
                }`}
        >
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-4 px-6 h-20 border-b border-border/50 shrink-0 select-none">
                <div className={`flex items-center gap-3 overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        <LayoutDashboard className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        HR Portal
                    </span>
                </div>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 hide-scrollbar">
                {/* Dashboard */}
                <button
                    onClick={() => navigate('/')}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer active:scale-95 group ${location.pathname === '/'
                        ? 'bg-accent text-accent-foreground shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
                        }`}
                >
                    <LayoutDashboard className={`w-5 h-5 shrink-0 transition-transform duration-300 ${location.pathname === '/' ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />
                    {!isCollapsed && <span className="tracking-wide">Dashboard Utama</span>}
                </button>

                {/* Master Data Group */}
                <div className="mb-4">
                    <button
                        onClick={() => {
                            if (isCollapsed) {
                                setIsCollapsed(false);
                                setIsMasterOpen(true);
                            } else {
                                setIsMasterOpen(!isMasterOpen);
                            }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group ${isMasterActive && !isMasterOpen && isCollapsed
                            ? 'bg-accent text-accent-foreground shadow-sm border border-border'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <Database className={`w-5 h-5 shrink-0 transition-colors ${isMasterActive ? 'text-indigo-500 dark:text-indigo-400' : 'group-hover:text-indigo-400 dark:group-hover:text-indigo-300'}`} />
                            {!isCollapsed && <span className="tracking-wide">Master Data</span>}
                        </div>
                        {!isCollapsed && (
                            <>
                                {isMasterActive && !isMasterOpen && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                )}
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${isMasterOpen ? 'rotate-180 text-indigo-500' : 'group-hover:text-foreground'}`}
                                />
                            </>
                        )}
                    </button>

                    <div className={`grid transition-all duration-300 ease-in-out ${!isCollapsed && isMasterOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                        <div className="overflow-hidden">
                            <div className="ml-6 pl-4 border-l-2 border-border/50 space-y-1 py-1">
                                {masterDataItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <button
                                            key={item.href}
                                            onClick={() => navigate(item.href)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] group/item ${active
                                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-l border-indigo-500'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border-l border-transparent hover:border-border'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-indigo-600 dark:text-indigo-400' : 'group-hover/item:text-indigo-500 dark:group-hover/item:text-indigo-300'}`} />
                                            <span className="truncate tracking-wide">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manajemen Karyawan Group */}
                <div className="pt-4 border-t border-border/50 mt-4">
                    <button
                        onClick={() => {
                            if (isCollapsed) {
                                setIsCollapsed(false);
                                setIsKaryawanOpen(true);
                            } else {
                                setIsKaryawanOpen(!isKaryawanOpen);
                            }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group ${isKaryawanGroupActive && !isKaryawanOpen && isCollapsed
                            ? 'bg-accent text-accent-foreground shadow-sm border border-border'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <Users className={`w-5 h-5 shrink-0 transition-colors ${isKaryawanGroupActive ? 'text-emerald-400' : 'group-hover:text-emerald-300'}`} />
                            {!isCollapsed && <span className="tracking-wide">Manajemen Karyawan</span>}
                        </div>
                        {!isCollapsed && (
                            <>
                                {isKaryawanGroupActive && !isKaryawanOpen && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                )}
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${isKaryawanOpen ? 'rotate-180 text-emerald-400' : 'group-hover:text-foreground'}`}
                                />
                            </>
                        )}
                    </button>

                    <div className={`grid transition-all duration-300 ease-in-out ${!isCollapsed && isKaryawanOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                        <div className="overflow-hidden">
                            <div className="ml-6 pl-4 border-l-2 border-border/50 space-y-1 py-1">
                                {manajemenKaryawanItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <button
                                            key={item.href}
                                            onClick={() => navigate(item.href)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] group/item ${active
                                                ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-foreground border-l border-emerald-500'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border-l border-transparent hover:border-border'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-emerald-400' : 'group-hover/item:text-emerald-300'}`} />
                                            <span className="truncate tracking-wide">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Import/Export Group */}
                <div className="pt-4 border-t border-border/50 mt-4">
                    <button
                        onClick={() => {
                            if (isCollapsed) {
                                setIsCollapsed(false);
                                setIsImportExportOpen(true);
                            } else {
                                setIsImportExportOpen(!isImportExportOpen);
                            }
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer active:scale-95 group ${location.pathname.startsWith('/hr/import-export')
                            ? 'bg-accent text-accent-foreground shadow-sm border border-border'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
                            }`}
                    >
                        <FileSpreadsheet className={`w-5 h-5 shrink-0 transition-colors duration-300 ${location.pathname.startsWith('/hr/import-export') ? 'text-rose-400' : 'group-hover:text-rose-300'}`} />
                        {!isCollapsed && (
                            <>
                                <span className="flex-1 text-left tracking-wide">Import / Export</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${isImportExportOpen ? 'rotate-0' : '-rotate-90'
                                        }`}
                                />
                            </>
                        )}
                    </button>

                    <div className={`grid transition-all duration-300 ease-in-out ${!isCollapsed && isImportExportOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                        <div className="overflow-hidden">
                            <div className="ml-6 pl-4 border-l-2 border-border/50 space-y-1 py-1">
                                {importExportItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <button
                                            key={item.href}
                                            onClick={() => navigate(item.href)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 cursor-pointer active:scale-[0.98] group/item ${active
                                                ? 'bg-gradient-to-r from-rose-500/20 to-transparent text-foreground border-l border-rose-500'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border-l border-transparent hover:border-border'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-rose-400' : 'group-hover/item:text-rose-300'}`} />
                                            <span className="truncate tracking-wide">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Collapse Toggle */}
            <div className="p-4 border-t border-border/50 shrink-0 bg-background">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3.5 top-6 w-7 h-7 bg-popover border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300 hover:scale-110 shadow-md z-50 cursor-pointer"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-sm font-medium tracking-wide">Sembunyikan Sidebar</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
