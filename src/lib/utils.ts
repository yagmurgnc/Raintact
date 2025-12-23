import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPhoneNumber(value: string) {
    if (!value) return "";

    // Kullanıcı sadece +90 girdiyse (başlangıç durumu), olduğu gibi bırak.
    if (value.trim() === "+90") return "+90";

    // Sayı olmayan tüm karakterleri temizle.
    let phoneNumber = value.replace(/[^\d]/g, "");

    // Eğer 90 ile başlıyorsa ve devamında rakam varsa (yani kullanıcı +90'dan sonra bir şey yazdıysa), 90'ı 0 ile değiştir.
    // Örnek: giriş "+90 5..." -> "905..." -> "05..."
    if (phoneNumber.startsWith("90") && phoneNumber.length > 2) {
        phoneNumber = "0" + phoneNumber.substring(2);
    }

    // Eğer bir cep telefonu numarası gibi görünüyorsa (5 ile başlıyorsa) başına 0 ekle.
    if (phoneNumber.startsWith("5")) {
        phoneNumber = "0" + phoneNumber;
    }

    const phoneNumberLength = phoneNumber.length;

    // Eğer kısa ise, olduğu gibi döndür.
    if (phoneNumberLength < 4) return phoneNumber;

    // 0555 formatı
    if (phoneNumberLength < 7) {
        return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
    }

    // 0555 555 formatı
    if (phoneNumberLength < 9) {
        return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
    }

    // 0555 555 55 55 (11 haneli standart TR formatı)
    return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
}

export async function processImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas context failed"));
                return;
            }

            // Target dimensions
            const TARGET_SIZE = 250;
            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;

            // Calculate crop
            const minSize = Math.min(img.width, img.height);
            const startX = (img.width - minSize) / 2;
            const startY = (img.height - minSize) / 2;

            // Draw cropped image
            ctx.drawImage(
                img,
                startX, startY, minSize, minSize, // Source crop
                0, 0, TARGET_SIZE, TARGET_SIZE    // Dest resize
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const optimizedFile = new File([blob], file.name, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(optimizedFile);
                    } else {
                        reject(new Error("Canvas to Blob failed"));
                    }
                },
                "image/jpeg",
                0.8 // Quality (0.8 is good balance for optimization)
            );
        };
        img.onerror = (error) => reject(error);
    });
}
