import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import HRSidebar from './HRSidebar';
import { authService } from '@/services/auth.service';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface HRLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: Breadcrumb[];
}

export default function HRLayout({ children, breadcrumbs = [] }: HRLayoutProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
            <HRSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 h-16 border-b border-white/5 shrink-0">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-sm">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />}
                                {crumb.href ? (
                                    <button
                                        onClick={() => navigate(crumb.href!)}
                                        className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {crumb.label}
                                    </button>
                                ) : (
                                    <span className="text-neutral-200 font-medium">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm">Keluar</span>
                    </button>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </main>
        </div>
    );
}
