import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Contact } from "@/app/data/contacts";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ContactDetailSheetProps {
    contact: Contact | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ContactDetailSheet({ contact, open, onOpenChange }: ContactDetailSheetProps) {
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (open) {
            setImageLoading(true);
        }
    }, [open, contact?.avatarUrl]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className=" m-4 h-auto  overflow-hidden rounded-lg">
                <SheetHeader className="px-4 py-6  h-32 bg-[linear-gradient(90deg,#A8D37F_0%,#3B3B3B_100%)]">
                    <SheetTitle className="text-xl font-bold text-white ">Kişi Detayları</SheetTitle>
                </SheetHeader>

                <div className="flex px-6 -mt-16 ">
                    {contact?.avatarUrl ? (
                        <div className="relative">
                            {imageLoading && (
                                <Skeleton className="aspect-square w-25 border-[2.5px] border-white rounded-full bg-zinc-200 absolute inset-0 z-10" />
                            )}
                            <img
                                src={contact.avatarUrl}
                                alt={contact.name}
                                onLoad={() => setImageLoading(false)}
                                className={cn(
                                    "aspect-square w-25 flex items-center justify-center border-[2.5px] border-white rounded-full object-cover bg-zinc-200",
                                    imageLoading && "opacity-0"
                                )}
                            />
                        </div>
                    ) : (
                        <div className="flex w-25 aspect-square items-center justify-center rounded-full bg-zinc-200 border-[2.5px] border-white">
                            <span className="font-bold text-zinc-500">{contact?.initials}</span>
                        </div>
                    )}
                </div>
                <div className="px-6  ">
                    <h2 className="text-2xl font-bold text-zinc-900">{contact?.name}</h2>
                    <span className="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                        {contact?.status}
                    </span>
                </div>
                {contact && (
                    <div className=" flex flex-col gap-6">


                        <div className="">
                            <div className=" px-6 py-3 shadow-sm">
                                <label className="text-xs font-medium text-zinc-500 uppercase">E-Posta</label>
                                <p className="font-medium text-zinc-900">{contact.email}</p>
                            </div>
                            <div className=" px-6 py-3 shadow-sm">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Telefon</label>
                                <p className="font-medium text-zinc-900">{contact.phone}</p>
                            </div>
                            <div className=" px-6 py-3 shadow-sm">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Kayıt Tarihi</label>
                                <p className="font-medium text-zinc-900">12.12.2024</p>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}