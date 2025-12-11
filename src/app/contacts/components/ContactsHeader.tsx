import Image from "next/image";
import { ArchiveBox } from 'iconsax-reactjs';

export default function ContactsHeader() {
    return (
        <div>
            <Image src="/logo/logo.svg" alt="raintact" width={100} height={100}>
            </Image>
            <ArchiveBox size="32" color="#697689" />
        </div>

    )
}