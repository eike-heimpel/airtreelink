import { toast } from 'svelte-french-toast';
import { browser } from '$app/environment';
import DOMPurify from 'dompurify';

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

export function sanitizeHtml(html) {
    if (browser) {
        return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    }
}