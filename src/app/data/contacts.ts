export type ContactStatus = string;

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: ContactStatus;
    avatarUrl?: string;
    initials: string;
}


