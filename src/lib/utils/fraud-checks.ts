// $lib/fraud-checks.ts

import dns from 'dns';
import { Netmask } from 'netmask';
import axios from 'axios';
import { IPQS_API_KEY } from '$env/static/private';


// Check if an email domain is suspicious
const suspiciousDomains = [
    'example.com',
    'spam.com',
    'fakeemail.com',
    'disposable.com',
    'temporary-mail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwawaymail.com',
    'yopmail.com',
    'trashmail.com',
    'tempmail.org',
    'sharklasers.com',
    'grr.la',
    'guerrillamailblock.com',
    'spamgourmet.com',
    'anonymouse.org',
    'sendanonymousemail.com',
    'mytemp.email',
    '10minutemail.com',
    'temp-mail.org',
];

const privateIPRanges = [
    new Netmask('10.0.0.0/8'),
    new Netmask('172.16.0.0/12'),
    new Netmask('192.168.0.0/16'),
    new Netmask('127.0.0.0/8') // loopback address
];



export async function isSuspiciousEmail(email: string | null): Promise<boolean> {
    if (!email) return false;
    const emailDomain = email.split('@')[1];

    // Check against suspicious domains
    if (suspiciousDomains.includes(emailDomain)) {
        return true;
    }

    // Check against IPQualityScore
    try {
        const ipqsResponse = await axios.get(`https://www.ipqualityscore.com/api/json/email/${IPQS_API_KEY}/${email}`);
        if (ipqsResponse.data.valid === false || ipqsResponse.data.suspicious) {
            return true;
        }
    } catch (error) {
        console.error('IPQualityScore API error:', error.message);
    }

    // // Check against Have I Been Pwned
    // try {
    //     const hibpResponse = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
    //         headers: {
    //             'hibp-api-key': HIBP_API_KEY,
    //             'User-Agent': 'YourAppNameHere' // Replace with your app name
    //         }
    //     });
    //     if (hibpResponse.data.length > 0) {
    //         return true;
    //     }
    // } catch (error) {
    //     if (error.response && error.response.status !== 404) {
    //         console.error('Have I Been Pwned API error:', error.message);
    //     }
    // }
    return false;
}


export function isHighRiskCountry(country: string | undefined): boolean {
    if (!country) return false;

    const highRiskCountries = [
        'RU', // Russia
        'CN', // China
        'VN', // Vietnam
        'ID', // Indonesia
        'PK', // Pakistan
        'NG', // Nigeria
        'IR', // Iran
        'IQ', // Iraq
        'VE', // Venezuela
        'EG', // Egypt
        'UA', // Ukraine
        'KE', // Kenya
        'PH', // Philippines
        'TR', // Turkey
    ];
    return highRiskCountries.includes(country);
}

