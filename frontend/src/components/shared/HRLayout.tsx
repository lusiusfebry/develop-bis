import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import HRSidebar from './HRSidebar';
import { authService } from '@/services/auth.service';
import { ThemeSelector } from './ThemeSelector';

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
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans relative">
            {/* Optional subtle textured overlay */}
            <div className="absolute inset-0 bg-[url('/mining-bg.png')] opacity-[0.05] dark:opacity-[0.03] mix-blend-multiply dark:mix-blend-overlay pointer-events-none z-0 bg-cover bg-center"></div>

            <HRSidebar />

            <main className="flex-1 flex flex-col overflow-hidden relative z-10">
                {/* Header Premium Glassmorphism */}
                <header className="flex items-center justify-between px-6 sm:px-10 h-20 bg-background/60 dark:bg-black/10 backdrop-blur-[40px] border-b border-border/50 z-20 shrink-0 select-none">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-2">
                                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />}
                                {crumb.href ? (
                                    <button
                                        onClick={() => navigate(crumb.href!)}
                                        className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer font-medium tracking-wide"
                                    >
                                        {crumb.label}
                                    </button>
                                ) : (
                                    <span className="text-foreground/90 font-semibold tracking-wide drop-shadow-sm">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <ThemeSelector />

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-card/50 border border-border/50 text-muted-foreground/70 hover:text-foreground hover:bg-accent/50 hover:border-border hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer active:scale-95"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            <span className="hidden sm:inline text-sm font-medium tracking-wide">Keluar Sistem</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-10 hide-scrollbar scroll-smooth">{children}</div>
            </main>
        </div>
    );
}
