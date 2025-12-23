import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Contact } from "@/app/data/contacts";
import ContactRow from "./ContactRow";

import { Skeleton } from "@/components/ui/skeleton";

interface ContactTableProps {
    contacts: Contact[];
    onUpdateContact: (contact: Contact) => void;
    onDeleteContact: (contactId: string) => void;
    onRowClick: (contact: Contact) => void;
    groups: { id: string; label: string }[];
    onAddGroup: (groupName: string) => void;
    loading?: boolean;
}

export default function ContactTable({ contacts, onUpdateContact, onDeleteContact, onRowClick, groups, onAddGroup, loading }: ContactTableProps) {
    return (
        <div className="rounded-md p-3 gap-2 border mt-4 w-[80%] mx-auto border-none shadow-md ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Avatar</TableHead>
                        <TableHead>İsim</TableHead>
                        <TableHead>E-Posta</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Statü</TableHead>
                        <TableHead>Eylemler</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <>
                            {contacts.map((contact, index) => (
                                <ContactRow
                                    key={contact.id}
                                    contact={contact}
                                    onUpdateContact={onUpdateContact}
                                    onDeleteContact={onDeleteContact}
                                    onRowClick={onRowClick}
                                    groups={groups}
                                    onAddGroup={onAddGroup}
                                    index={index}
                                />
                            ))}
                            {contacts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Sonuç bulunamadı.
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}