import { toast } from 'svelte-french-toast';

export function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
        () => {
            console.log('Address copied to clipboard');
            toast.success('Address copied to clipboard!');
        },
        (err) => {
            console.error('Could not copy text: ', err);
        }
    );
}