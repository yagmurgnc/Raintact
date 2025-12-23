import { TableCell, TableRow } from "@/components/ui/table";
import { formatPhoneNumber, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Contact } from "@/app/data/contacts";
import { EditContactDialog } from "./EditContactDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Trash } from "iconsax-reactjs";
import ContactHoverCard from "./ContactHoverCard";

import { useState } from "react";

interface ContactRowProps {
    contact: Contact;
    onUpdateContact: (contact: Contact) => void;
    onDeleteContact: (contactId: string) => void;
    onRowClick: (contact: Contact) => void;
    groups: { id: string; label: string }[];
    onAddGroup: (groupName: string) => void;
    index: number;
}

export default function ContactRow({ contact, onUpdateContact, onDeleteContact, onRowClick, groups, onAddGroup, index }: ContactRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <TableRow
            className="cursor-pointer hover:bg-zinc-100/50 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onRowClick(contact)}
        >
            <TableCell onClick={(e) => e.stopPropagation()}>
                <ContactHoverCard contact={contact} disabled={isEditing || isDeleting}>
                    <div className="relative inline-block h-10 w-10">
                        {contact.avatarUrl ? (
                            <>
                                {imageLoading && (
                                    <Skeleton className="absolute inset-0 h-10 w-10 rounded-full" />
                                )}
                                <img
                                    src={contact.avatarUrl}
                                    alt={contact.name}
                                    className={cn("h-10 w-10 rounded-full object-cover bg-zinc-200", imageLoading && "opacity-0")}
                                    onLoad={() => setImageLoading(false)}
                                />
                            </>
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200">
                                <span className="text-sm font-medium uppercase text-muted-foreground">
                                    {contact.initials}
                                </span>
                            </div>
                        )}
                    </div>
                </ContactHoverCard>
            </TableCell>
            <TableCell className="font-medium">
                <ContactHoverCard contact={contact} disabled={isEditing || isDeleting}>
                    <span className="cursor-default">{contact.name}</span>
                </ContactHoverCard>
            </TableCell>
            <TableCell>
                <ContactHoverCard contact={contact} disabled={isEditing || isDeleting}>
                    <span className="cursor-default">{contact.email}</span>
                </ContactHoverCard>
            </TableCell>
            <TableCell>
                <ContactHoverCard contact={contact} disabled={isEditing || isDeleting}>
                    <span className="cursor-default">{formatPhoneNumber(contact.phone)}</span>
                </ContactHoverCard>
            </TableCell>
            <TableCell>
                <ContactHoverCard contact={contact} disabled={isEditing || isDeleting}>
                    <span className="cursor-default">{contact.status}</span>
                </ContactHoverCard>
            </TableCell>

            <TableCell className="w-20 gap-2 " onClick={(e) => e.stopPropagation()}>
                <div className="gap-3 flex">
                    <EditContactDialog
                        contact={contact}
                        onSave={onUpdateContact}
                        open={isEditing}
                        onOpenChange={setIsEditing}
                        groups={groups}
                        onAddGroup={onAddGroup}
                    />

                    <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="[&>svg>path]:!stroke-[2.5px] border-none rounded-full shadow-sm">
                                <Trash size="20" color="#bd0606ff" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Kişi Silinsin mi?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hayır</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteContact(contact.id)}>Evet</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        </TableRow>
    )
}