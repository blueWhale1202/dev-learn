import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function moveElement<T>(arr: T[], from: number, to: number) {
    const newArr = [...arr];
    const element = newArr.splice(from, 1)[0];
    newArr.splice(to, 0, element);

    return newArr;
}
