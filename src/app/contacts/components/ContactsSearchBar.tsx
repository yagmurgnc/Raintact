import { Input } from "@/components/ui/input";
import { SearchFavorite1, SearchNormal1 } from "iconsax-reactjs";

interface ContactsSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ContactsSearchBar({ value, onChange }: ContactsSearchBarProps) {
    return (
        <div className="relative  flex justify-center items-center sticky top-4  left-1/2 -translate-x-1/2  z-15  ">
            <div className="rounded-full shadow-sm  w-100 flex px-3 border border-zinc-200 dark:border-zinc-800 ">
                <Input
                    placeholder="Kişilerde ara..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className=" pl-8  dark:bg-black/50 border-zinc-200 dark:border-zinc-800 "
                />
                <SearchFavorite1
                    size="20"
                    color="#444444ff"
                    className="absolute min-w-s top-1/2 -translate-y-1/2 pointer-events-none"
                />
            </div>
        </div>
    );
}
