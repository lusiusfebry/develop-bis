import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Search, X } from "lucide-react";

export interface ComboboxOption {
    value: string;
    label: string;
}

export interface ComboboxProps {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    className?: string;
    allowClear?: boolean;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Pilih...",
    searchPlaceholder = "Cari...",
    disabled = false,
    className = "",
    allowClear = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const selectedOption = React.useMemo(
        () => options.find((opt) => opt.value === value),
        [options, value]
    );

    const filteredOptions = React.useMemo(() => {
        if (!search) return options;
        const lowerSearch = search.toLowerCase();
        return options.filter((opt) => opt.label.toLowerCase().includes(lowerSearch));
    }, [options, search]);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <div className="relative">
                <Popover.Trigger asChild>
                    <button
                        disabled={disabled}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-sm transition-all duration-300 outline-none hover:shadow-sm active:scale-[0.98]
              ${disabled
                                ? "bg-card/50 border-white/5 text-muted-foreground/80 cursor-not-allowed"
                                : "bg-card/50 border-border/50 text-white hover:border-border hover:bg-accent/50 focus:border-border/80 focus:ring-1 focus:ring-ring/50 cursor-pointer"
                            }
              ${className}
            `}
                    >
                        <span className="truncate flex-1 text-left">
                            {selectedOption ? selectedOption.label : <span className="text-muted-foreground/80">{placeholder}</span>}
                        </span>
                        <div className="flex items-center gap-2">
                            {allowClear && selectedOption && !disabled && (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    className="rounded hover:bg-accent/50 p-0.5"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.stopPropagation();
                                            onChange("");
                                        }
                                    }}
                                >
                                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                            )}
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                        </div>
                    </button>
                </Popover.Trigger>
            </div>

            <Popover.Content
                align="start"
                className="z-50 w-[var(--radix-popover-trigger-width)] rounded-2xl border border-border/50 bg-black/60 backdrop-blur-2xl p-1 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
                sideOffset={4}
            >
                <div className="flex items-center border-b border-white/5 px-3 py-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground/80" />
                    <input
                        className="flex h-10 w-full rounded-md bg-transparent text-sm text-foreground placeholder:text-muted-foreground/80 outline-none"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground/80">
                            Data tidak ditemukan.
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm outline-none transition-colors cursor-pointer
                  ${option.value === value
                                        ? "bg-accent text-foreground font-medium shadow-sm"
                                        : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                                    }
                `}
                            >
                                <span className="truncate">{option.label}</span>
                                {option.value === value && (
                                    <Check className="h-4 w-4 shrink-0 text-indigo-400" />
                                )}
                            </button>
                        ))
                    )}
                </div>
            </Popover.Content>
        </Popover.Root>
    );
}
