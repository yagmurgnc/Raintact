"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

import { formatPhoneNumber, processImage } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Add, Edit2, Gallery, MessageFavorite } from "iconsax-reactjs"
import { Contact } from "@/app/data/contacts"
import { useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"


export function EditContactDialog({
    contact,
    onSave,
    open,
    onOpenChange,
    groups,
    onAddGroup
}: {
    contact: Contact,
    onSave: (contact: Contact) => void,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    groups: { id: string; label: string }[];
    onAddGroup: (groupName: string) => void;
}) {
    const [formData, setFormData] = useState({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        status: contact.status,
        avatarUrl: contact.avatarUrl
    })
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (open) {
            setImageLoading(true);
        }
    }, [open, contact.avatarUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageLoading(true);
            try {
                const optimized = await processImage(file);
                setSelectedFile(optimized);
                setFormData(prev => ({ ...prev, avatarUrl: URL.createObjectURL(optimized) }));
            } catch (error) {
                console.error("Image processing failed:", error);
            }
        }
    };
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        let finalValue = value;
        if (name === "phone") {
            finalValue = formatPhoneNumber(value);
        }
        setFormData(prev => ({ ...prev, [name]: finalValue }))
    }

    const handleSave = async () => {
        setLoading(true);
        let finalAvatarUrl = formData.avatarUrl;

        if (selectedFile) {
            try {
                // File is already optimized in handleFileChange
                const fileExt = "jpg";
                const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9]/g, ' ').trim().replace(/\s+/g, '-').toLowerCase();
                const fileName = `${Date.now()}-${cleanName}.${fileExt}`;
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, selectedFile);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);

                finalAvatarUrl = publicUrl;
            } catch (error) {
                console.error("Avatar upload failed:", error);
                setLoading(false);
                return;
            }
        }

        onSave({ ...contact, ...formData, avatarUrl: finalAvatarUrl });
        onOpenChange(false);
        setLoading(false);
        setSelectedFile(null);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild >

                <Button variant="outline" className="[&>svg>path]:!stroke-[2.5px] border-none rounded-full shadow-md">
                    <Edit2 size="20" color="#0224abff" />
                </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={false} className="px-8 pb-8 ">


                <DialogHeader className="">
                    <div className="flex rounded-lg -mx-7 px-5 py-12 h-24 bg-[linear-gradient(90deg,#A8D37F_0%,#3B3B3B_100%)]">
                        <div
                            onClick={handleAvatarClick}
                            className="relative mt-3 h-18 w-18 rounded-full border-3 border-white overflow-hidden cursor-pointer group"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />

                            {formData.avatarUrl ? (
                                <>
                                    {imageLoading && (
                                        <Skeleton className="absolute inset-0 h-full w-full bg-zinc-200" />
                                    )}
                                    <img
                                        src={formData.avatarUrl}
                                        alt={contact.name}
                                        className={cn("h-full w-full object-cover bg-zinc-200", imageLoading && "opacity-0")}
                                        onLoad={() => setImageLoading(false)}
                                    />
                                </>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-200">
                                    <span className="font-bold text-zinc-500">{contact.initials}</span>
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Gallery size="20" className="text-white drop-shadow-md" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 pb-0 gap-1 flex flex-col ">
                        <DialogTitle className="font-semibold text-2xl">{contact.name}</DialogTitle>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <MessageFavorite size="15" color="#212121ff" /></div><span className="text-sm justify-between text-muted-foreground  flex font-semibold">{contact.email}</span>
                        </div>


                        <div className="flex py-4 gap-2 items-center ">

                            <div className="relative border flex items-center justify-center border-zinc-200 rounded-full px-3 py-1 cursor-default bg-zinc-50">
                                <span className="text-xs font-medium">{formData.status}</span>
                            </div>

                            <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
                                <Add size="16" color="#2b2b2bff" />
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
                                >
                                    {groups.filter(g => g.id !== "all").map(group => (
                                        <option key={group.id} value={group.label}>
                                            {group.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>


                </DialogHeader>

                <div className="grid gap-4 py-5">
                    <div className="flex flex-row items-center gap-4">
                        <Label htmlFor="name" className=" w-2/8 text-right">
                            Ad - Soyad
                        </Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} className=" border border-zinc-200 w-full rounded-lg " />
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <Label htmlFor="email" className=" w-2/8 text-right">
                            E-Posta
                        </Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleChange} className=" border border-zinc-200 w-full rounded-lg" />
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <Label htmlFor="phone" className=" w-2/8 text-right">
                            Telefon
                        </Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className=" border border-zinc-200 w-full rounded-lg" />
                    </div>


                </div>
                <DialogFooter className="gap-2 pt-5 border-t gap-2 border-zinc-200 flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
                        Vazgeç
                    </Button>
                    <Button type="submit" onClick={handleSave} disabled={loading} className="rounded-lg">
                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
