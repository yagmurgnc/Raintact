import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Contact } from "@/app/data/contacts"
import { Call, MessageFavorite, ProfileTick } from "iconsax-reactjs";
import { formatPhoneNumber } from "@/lib/utils";

interface ContactHoverCardProps {
    contact: Contact;
    children: React.ReactNode;
    disabled?: boolean;
}

export default function ContactHoverCard({ contact, children, disabled }: ContactHoverCardProps) {
    if (disabled) {
        return <>{children}</>;
    }

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80 flex flex-col gap-8 items-center shadow-2xl ">

                <div className="flex gap-4 -mt-3 w-78 rounded-lg px-4 py-7 h-12 bg-[linear-gradient(90deg,#A8D37F_0%,#3B3B3B_100%)] ">
                    {contact.avatarUrl ? (
                        <img src={contact.avatarUrl} alt={contact.name} className="w-14 h-14 flex items-center justify-center border-[2.5px] border-zinc-100 rounded-full object-cover" />
                    ) : (
                        <div className="flex w-14 h-14  items-center justify-center rounded-full bg-zinc-200">
                            <span className="font-bold text-zinc-500">{contact.initials}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-3 w-72 ">
                    <div className="py-2  ">
                        <h4 className="font-semibold">{contact.name}</h4>
                        <span className="text-xs text-muted-foreground">{contact.status}</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Call size="15" color="#212121ff" /><p className="text-sm text-muted-foreground ">Telefon:</p> </div><span className="text-sm justify-between flex font-semibold">{formatPhoneNumber(contact.phone)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageFavorite size="15" color="#212121ff" /><p className="text-sm text-muted-foreground ">E-Posta:</p> </div><span className="text-sm justify-between flex font-semibold">{contact.email}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ProfileTick size="15" color="#212121ff" /><p className="text-sm text-muted-foreground ">Grup:</p> </div><span className="text-sm justify-between flex font-semibold">{contact.status}</span>
                        </div>

                    </div>

                </div>
            </HoverCardContent>
        </HoverCard>
    )
}