# Reuploader

A simple library for handling requests 


## Fetch Google API Offline Refresh Token

Required for Google API's, eg the Youtube uploader/fetcher.

1. Create the project in Google Developer Console
2. Set Youtube scopes
3. Set up OAuth credentials
4. Enter the credential Client Id and Secret into .env:

5. Run the user consent token fetcher using the credentials from .env:

```
export $(cat .env | xargs) && node --loader ts-node/esm --no-warnings ./scripts/user-fetch-google-oauth-refresh-token.ts
```

6. Save the refresh token from the fetch script result