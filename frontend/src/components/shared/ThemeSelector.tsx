import { Moon, Sun, Laptop, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeSelector() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full overflow-hidden transition-colors border-border bg-background hover:bg-accent hover:text-accent-foreground text-foreground">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 theme-corporate:-rotate-90 theme-corporate:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 theme-corporate:rotate-90 theme-corporate:scale-0" />
                    <Building2 className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all theme-corporate:rotate-0 theme-corporate:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-2xl shadow-xl bg-popover text-popover-foreground border-border z-50">
                <DropdownMenuItem onClick={() => setTheme("light")} className={`cursor-pointer rounded-xl my-1 flex items-center gap-2 ${theme === 'light' ? 'bg-accent text-accent-foreground' : ''}`}>
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className={`cursor-pointer rounded-xl my-1 flex items-center gap-2 ${theme === 'dark' ? 'bg-accent text-accent-foreground' : ''}`}>
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("corporate")} className={`cursor-pointer rounded-xl my-1 flex items-center gap-2 ${theme === 'corporate' ? 'bg-amber-500/10 text-amber-500' : ''}`}>
                    <Building2 className="h-4 w-4" />
                    <span>Brand Color</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className={`cursor-pointer rounded-xl my-1 flex items-center gap-2 ${theme === 'system' ? 'bg-accent text-accent-foreground' : ''}`}>
                    <Laptop className="h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
