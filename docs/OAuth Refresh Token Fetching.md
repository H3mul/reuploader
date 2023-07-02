## Fetch Google API Offline Refresh Token

**Required for the [YoutubeUploader](../README.md#youtubeuploader)**

The Google API is authenticated via an offline refresh token, acquired from the user consent OAuth process. It should survive consistent use for a while - see details on expiration here:

https://developers.google.com/identity/protocols/oauth2#expiration

Specific notes:
- Refresh tokens for Google Developer Console apps in "Testing" mode expire in 7 days
- Token count is limited at 100 per google account (the 101st token gen silently revokes the oldest token)
- Tokens are auto-revoked after 6 months of no use 

The token needs to be fetched manually, stored separately, and provided to the Youtube Uploader upon init.

1. Set up a project with the Youtube API enabled and an OAuth2 credential in the Developer Console

    Rough guideline video:
https://youtu.be/irhhMLKDBZ8

2. Set Youtube scopes for the API

- `https://www.googleapis.com/auth/youtube.upload`    (required to upload videos)
- `https://www.googleapis.com/auth/youtube.readonly`  (required to look up the playlist)
- `https://www.googleapis.com/auth/youtube`           (required to add the new video to a playlist)

3. Enter the credential Client Id and Secret into a `.env` file, eg:

```bash
# .env
YOUTUBE_CLIENT_ID=<oauth2 client id>
YOUTUBE_CLIENT_SECRET=<oauth2 client secret>
```

4. Run the token fetcher script - after the consent process, the token will be saved into the file `.token.json`

```bash
export $(cat .env | xargs) && \
    node --loader ts-node/esm --no-warnings \
    ./scripts/user-fetch-google-oauth-refresh-token.ts > .token.json
```

5. Store the contents of `.token.json`, and provide it to the youtube uploader constructor (see `examples/upload-test.ts`)


## Notes on storage

### 1. Security

No need to secure token content in storage - it is useless without OAuth Client Id/Secret ([discussion](https://stackoverflow.com/questions/71127825/correctly-storing-google-oauth-access-token))

### 2. Token format

The token object returned from the consent process is actually the access + refresh tokens, expiration date and scopes:

```json
# .token.json
{
  "access_token": "<access token>",
  "refresh_token": "<refresh token>",
  "scope": "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
  "token_type": "Bearer",
  "expiry_date": 1688291973002
}
```

- The access token usually expires in 1h - you may consider updating your external store with a fresh token every gen as it could save you several refreshes
- In order to refresh the token, the google [OAuth2Client](https://github.com/googleapis/google-auth-library-nodejs) only needs the `refresh_token`, `scopes`, and a past `expiry_date` - the `access_token` field is ignored in the expired case and can be any garbage string
- Technically it is enough to store only the `refresh_token` alone, and spoof the rest of this structure, at the cost of a token refresh every init