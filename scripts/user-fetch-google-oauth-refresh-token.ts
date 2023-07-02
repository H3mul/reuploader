import { createInterface } from 'node:readline/promises'
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

/**
 * This script allows fetching an offline refresh token via the Google user consent OAuth process.
 * The refresh token should survive consistent use for a while - see details on expiration here:
 * https://developers.google.com/identity/protocols/oauth2#expiration
 * 
 * Specific notes:
 *  - Refresh tokens for Google Platform projects in "Testing" expire in 7 days
 *  - Token count is limited at 100 per google account (a 101st token gen silently revokes the oldest token)
 *  - Tokens are auto-revoked after 6 months of no use 
 */

const SCOPES = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
];

const oauth2Client = new OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    "http://localhost"
);

const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

console.error('Authorize this app by visiting this url:', '\n');
console.error(authUrl, '\n');

const rl = createInterface({
    input: process.stdin,
    output: process.stderr
});

const code = await rl.question('Enter the OAuth code from the consent redirect URL here: ');

const { tokens } = await oauth2Client.getToken(code);
console.error();
console.error('Tokens retrieved');
console.log(JSON.stringify(tokens, null, 2))

rl.close();