import Image from "next/image";
import { Add, ArchiveBox, Trash, Refresh, Edit2, Gallery, Call, MessageFavorite, ProfileTick } from 'iconsax-reactjs';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatPhoneNumber, cn, processImage } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"




import { useState, useRef, useEffect } from "react";
import { Contact } from "@/app/data/contacts";
import { supabase } from "@/lib/supabase";

interface ContactsHeaderProps {
    onAddContact: (contact: Contact) => void;
    archivedContacts: Contact[];
    onUnarchive: (id: string) => void;
    onPermanentDelete: (id: string) => void;
    groups: { id: string; label: string }[];
}

export default function ContactsHeader({ onAddContact, archivedContacts, onUnarchive, onPermanentDelete, groups }: ContactsHeaderProps) {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "+90 ",
        status: "Aile", // Default selection
        avatar: ""
    });

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageLoading(true);
            try {
                const optimized = await processImage(file);
                setSelectedFile(optimized);
                setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(optimized) }));
            } catch (error) {
                console.error("Image processing failed:", error);
            }
        }
    };

    useEffect(() => {
        if (!open) {
            setImageLoading(true);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Upload image if selected
        let finalAvatarUrl = "";
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
            } catch (error: any) {
                console.error("Avatar upload failed:", JSON.stringify(error, null, 2));
                alert("Resim yüklenemedi: " + (error.message || "Bilinmeyen hata"));
                setLoading(false);
                return; // Stop implementation if upload fails
            }
        }

        // Find the selected group to get the correct label
        const selectedGroup = groups.find(g => g.id === formData.status);
        // Default to "Diğer" or the first group if not found, though it should be found.
        const statusLabel = selectedGroup ? selectedGroup.label : "Diğer";

        const newContact: Contact = {
            id: "", // Will be set by parent/DB
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: statusLabel,
            avatarUrl: finalAvatarUrl, // Use uploaded URL
            initials: "" // Will be set by parent
        };

        onAddContact(newContact);
        setOpen(false);
        setLoading(false);
        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "+90 ",
            status: groups.length > 0 ? groups[0].id : "",
            avatar: ""
        });
        setSelectedFile(null);
    };

    return (
        <div className="flex justify-between items-center w-full sticky pt-5  pb-8 top-0 z-10  bg-[linear-gradient(180deg,_#FFF_0%,_#FFF_67.16%,_rgba(255,_255,_255,_0.00)_100%)] ">
            <Image src="/logo/logo.svg" alt="raintact" width={100} height={100}>
            </Image>

            <div className="flex gap-2 justify-center items-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="[&>svg>path]:!stroke-[2px] border-none rounded-full shadow-md  ">
                            <ArchiveBox size="20" color="#000000ff" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className=" rounded-md m-4 h-auto p-4">
                        <SheetHeader className="flex flex-col gap-6">
                            <SheetTitle>Arşivlenmiş Kişiler</SheetTitle>
                            <SheetDescription>
                                Arşivdeki kişileri buradan geri yükleyebilir veya silebilirsiniz.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 flex flex-col ">
                            {archivedContacts.length === 0 ? (
                                <div className="text-center text-zinc-500 text-sm">Arşivde kişi bulunmamaktadır.</div>
                            ) : (
                                archivedContacts.map(contact => (
                                    <div key={contact.id} className="flex shadow-lg m-4 px-6 py-2 items-center justify-between  rounded-full">
                                        <div className="flex flex-col px-2">
                                            <span className="font-medium text-sm">{contact.name}</span>
                                            <span className="text-xs text-zinc-500">{contact.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onUnarchive(contact.id)}
                                                title="Geri Yükle"
                                            >
                                                <Refresh size="18" className="text-blue-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onPermanentDelete(contact.id)}
                                                title="Tamamen Sil"
                                            >
                                                <Trash size="18" className="text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="[&>svg>path]:!stroke-[3px] border-none rounded-full shadow-md"><Add size="32" color="#000000ff" /></Button>
                    </DialogTrigger>
                    <DialogContent showCloseButton={false} className="sm:max-w-[465px] px-8 pb-8">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="sr-only">Yeni Kişi Ekle</DialogTitle>
                                <div className="flex b rounded-lg -mx-7 px-5 py-12 h-24 bg-[linear-gradient(90deg,#A8D37F_0%,#3B3B3B_100%)]">
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

                                        {formData.avatar ? (
                                            <>
                                                {imageLoading && (
                                                    <Skeleton className="absolute inset-0 h-full w-full bg-zinc-200" />
                                                )}
                                                <img
                                                    src={formData.avatar}
                                                    alt="Preview"
                                                    className={cn("h-full w-full object-cover bg-zinc-200", imageLoading && "opacity-0")}
                                                    onLoad={() => setImageLoading(false)}
                                                />
                                            </>
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-zinc-200">
                                                <span className="font-bold text-zinc-500">?</span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 transition-all duration-300">
                                            <Edit2 size="20" className="text-white drop-shadow-md" />
                                        </div>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="flex flex-col gap-2 -p-30 pt-8 ">

                                <div className="font-bold pt-3 ">
                                    <Input
                                        className="text-2xl px-0 "
                                        id="name-1"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ad Soyad"

                                    />
                                </div>

                                <div className="flex pb-5 gap-2 items-center ">

                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger className="w-auto min-w-[120px] gap-2 rounded-full text-xs font-medium h-8 bg-zinc-50 border-zinc-200 shadow-sm focus:ring-0">
                                            <SelectValue>{formData.status}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.filter(g => g.id !== "all").map(group => (
                                                <SelectItem key={group.id} value={group.label}>
                                                    {group.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-4 py-">

                                    <div className="flex flex-row items-center gap-4">
                                        <Label htmlFor="email" className=" w-2/8 text-right">
                                            E-Posta
                                        </Label>
                                        <Input id="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className=" border border-zinc-200 w-full rounded-lg" />
                                    </div>
                                    <div className="flex flex-row items-center gap-4">
                                        <Label htmlFor="phone" className=" w-2/8 text-right">
                                            Telefon
                                        </Label>
                                        <Input id="phone" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })} className=" border border-zinc-200 w-full rounded-lg" />
                                    </div>


                                </div>

                            </div>

                            <div className="flex flex-col pt-6 gap-8">
                            </div>

                            <DialogFooter className="gap-2 pt-5 border-t gap-2 border-zinc-200 flex justify-end">
                                <DialogClose asChild>
                                    <Button variant="outline" type="button" className="text-muted-foreground hover:text-foreground">
                                        Vazgeç
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading} className="rounded-lg px-6">
                                    {loading ? "Ekleniyor..." : "Kişiyi Kaydet"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>


            </div>
        </div >
    )
}