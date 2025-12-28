import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
	if (!address) return "";
	if (address.length < 10) return address;

	return `${address.substring(0, 4)}…${address.substring(address.length - 4)}`;
}

export function formatTimestamp(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;

	if (diff < 60000) {
		return "Vừa xong";
	} else if (diff < 3600000) {
		const minutes = Math.floor(diff / 60000);
		return `${minutes} phút trước`;
	} else if (diff < 86400000) {
		const hours = Math.floor(diff / 3600000);
		return `${hours} giờ trước`;
	} else {
		const days = Math.floor(diff / 86400000);
		return `${days} ngày trước`;
	}
}






