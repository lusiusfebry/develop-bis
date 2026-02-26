import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { FieldConfig } from '@/types/master.types';

interface MasterDataFormProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: FieldConfig[];
    initialData?: Record<string, unknown>;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    isSubmitting: boolean;
}

// Komponen inner form — di-remount setiap kali Dialog dibuka via key
function FormContent({
    fields,
    initialData,
    onSubmit,
    onClose,
    isSubmitting,
}: {
    fields: FieldConfig[];
    initialData?: Record<string, unknown>;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    onClose: () => void;
    isSubmitting: boolean;
}) {
    const [formData, setFormData] = useState<Record<string, unknown>>(() => {
        if (initialData) return { ...initialData };
        const defaults: Record<string, unknown> = {};
        fields.forEach((f) => {
            defaults[f.name] = f.type === 'color' ? '#6366f1' : '';
        });
        return defaults;
    });
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [focused, setFocused] = useState<Record<string, boolean>>({});

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    const handleFocus = (name: string) => {
        setFocused((prev) => ({ ...prev, [name]: true }));
    };

    const handleBlur = (name: string) => {
        setFocused((prev) => ({ ...prev, [name]: false }));
    };

    // Cek apakah label harus melayang (ada value atau sedang focus)
    const isFloating = (name: string) => {
        const value = formData[name];
        return focused[name] || (typeof value === 'string' && value.length > 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, boolean> = {};
        let hasError = false;
        fields.forEach((f) => {
            if (f.required && !formData[f.name]) {
                newErrors[f.name] = true;
                hasError = true;
            }
        });

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        await onSubmit(formData);
    };

    // Class untuk border berdasarkan error state
    const borderClass = (name: string) =>
        errors[name]
            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/25'
            : 'border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/25';

    return (
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {fields.map((field) => (
                <div key={field.name}>
                    {/* Floating Label — text input */}
                    {field.type === 'text' && (
                        <div className="relative">
                            <input
                                type="text"
                                id={`field-${field.name}`}
                                value={(formData[field.name] as string) ?? ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                onFocus={() => handleFocus(field.name)}
                                onBlur={() => handleBlur(field.name)}
                                placeholder=" "
                                className={`peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border text-sm text-white focus:outline-none focus:ring-1 transition-all duration-200 ${borderClass(field.name)}`}
                            />
                            <label
                                htmlFor={`field-${field.name}`}
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFloating(field.name)
                                    ? 'top-1.5 text-[10px] font-medium text-indigo-400'
                                    : 'top-1/2 -translate-y-1/2 text-sm text-neutral-500'
                                    }`}
                            >
                                {field.label}
                                {field.required && <span className="text-red-400 ml-0.5">*</span>}
                            </label>
                        </div>
                    )}

                    {/* Floating Label — textarea */}
                    {field.type === 'textarea' && (
                        <div className="relative">
                            <textarea
                                id={`field-${field.name}`}
                                value={(formData[field.name] as string) ?? ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                onFocus={() => handleFocus(field.name)}
                                onBlur={() => handleBlur(field.name)}
                                rows={3}
                                placeholder=" "
                                className={`peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border text-sm text-white focus:outline-none focus:ring-1 transition-all duration-200 resize-none ${borderClass(field.name)}`}
                            />
                            <label
                                htmlFor={`field-${field.name}`}
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFloating(field.name)
                                    ? 'top-1.5 text-[10px] font-medium text-indigo-400'
                                    : 'top-3.5 text-sm text-neutral-500'
                                    }`}
                            >
                                {field.label}
                                {field.required && <span className="text-red-400 ml-0.5">*</span>}
                            </label>
                        </div>
                    )}

                    {/* Color picker — tetap konvensional */}
                    {field.type === 'color' && (
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-neutral-400">
                                {field.label}
                                {field.required && <span className="text-red-400 ml-1">*</span>}
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={(formData[field.name] as string) ?? '#6366f1'}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                                />
                                <div
                                    className="w-8 h-8 rounded-lg border border-white/10"
                                    style={{ backgroundColor: (formData[field.name] as string) ?? '#6366f1' }}
                                />
                                <span className="text-xs text-neutral-500 font-mono">
                                    {(formData[field.name] as string) ?? '#6366f1'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Select — tetap konvensional */}
                    {field.type === 'select' && (
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-neutral-400">
                                {field.label}
                                {field.required && <span className="text-red-400 ml-1">*</span>}
                            </label>
                            <select
                                value={(formData[field.name] as string) ?? ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white focus:outline-none focus:ring-1 transition-all duration-200 cursor-pointer ${borderClass(field.name)}`}
                            >
                                <option value="" className="bg-[#12121a]">
                                    Pilih {field.label.toLowerCase()}
                                </option>
                                {field.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-[#12121a]">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {errors[field.name] && (
                        <p className="text-xs text-red-400 mt-1">{field.label} wajib diisi</p>
                    )}
                </div>
            ))}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Simpan
                </button>
            </div>
        </form>
    );
}

export default function MasterDataForm({
    isOpen,
    onClose,
    title,
    fields,
    initialData,
    onSubmit,
    isSubmitting,
}: MasterDataFormProps) {
    // Generate unique key agar FormContent di-remount setiap dialog dibuka
    const [formKey, setFormKey] = useState(0);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        } else {
            setFormKey((k) => k + 1);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-[#12121a] border border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-white">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                {isOpen && (
                    <FormContent
                        key={formKey}
                        fields={fields}
                        initialData={initialData}
                        onSubmit={onSubmit}
                        onClose={onClose}
                        isSubmitting={isSubmitting}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
