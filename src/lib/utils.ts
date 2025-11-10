import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberToWords(num: number): string {
    if (num === 0) return 'Zero';

    const belowTwenty = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    const numStr = num.toString();
    const [integerPart, decimalPart] = numStr.split('.');

    function toWords(n: number): string {
        if (n < 20) return belowTwenty[n - 1] || '';
        if (n < 100) return (tens[Math.floor(n / 10) - 2] || '') + (n % 10 !== 0 ? ' ' + toWords(n % 10) : '');
        if (n < 1000) return (belowTwenty[Math.floor(n / 100) - 1] || '') + ' Hundred' + (n % 100 !== 0 ? ' ' + toWords(n % 100) : '');
        return '';
    }

    let words = '';
    let i = 0;
    let numInt = parseInt(integerPart, 10);

    if (numInt === 0 && integerPart !== '0') return "Invalid number";
    
    do {
        const chunk = numInt % 1000;
        if (chunk !== 0) {
            words = toWords(chunk) + (thousands[i] ? ' ' + thousands[i] : '') + (words ? ' ' + words : '');
        }
        numInt = Math.floor(numInt / 1000);
        i++;
    } while (numInt > 0);

    if (decimalPart) {
        const pesewas = Math.round(parseFloat('0.' + decimalPart) * 100);
        if (pesewas > 0) {
            words += ' and ' + toWords(pesewas) + ' Pesewas';
        }
    }

    return words.trim();
}
