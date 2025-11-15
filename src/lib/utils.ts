
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberToWords(num: number): string {
    const a = [
        '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const b = [
        '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];
    const g = [
        '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion'
    ];
    
    const decPart = Math.round((num - Math.floor(num)) * 100);
    const numInt = Math.floor(num);

    const toWords = (n: number): string => {
        if (n < 20) return a[n];
        const digit = n % 10;
        return `${b[Math.floor(n / 10)]}${digit ? '-' + a[digit] : ''}`;
    };

    const inThree = (n: number): string => {
        if (n < 100) return toWords(n);
        const rem = n % 100;
        return `${a[Math.floor(n / 100)]} hundred${rem ? ' ' + toWords(rem) : ''}`;
    };

    const intToWords = (n: number): string => {
        if (n === 0) return 'zero';
        let str = '';
        let i = 0;
        while (n > 0) {
            const rem = n % 1000;
            if (rem) {
                str = `${inThree(rem)} ${g[i]} ${str}`;
            }
            n = Math.floor(n / 1000);
            i++;
        }
        return str.trim();
    };

    let words = intToWords(numInt);
    
    if (decPart > 0) {
        words += ` and ${intToWords(decPart)} pesewas`;
    }

    return words.replace(/\s+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
