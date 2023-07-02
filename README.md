# Reuploader

A simple library to contain logic for uploading data streams to various destinations, with a consistent interface.

Implemented uploaders and supported features:

## YoutubeUploader

**Prerequisite: [set up OAuth refresh token](docs/OAuth%20Refresh%20Token%20Fetching.md)**

| Option Key | Description | Type |
| --- | ----------- | ------- |
| `title*`          | youtube video title           | string |
| `description*`    | youtube video description     | string |
| `source*`         | arbitrary data stream     | [node:stream](https://nodejs.org/api/stream.html)  |
| `insertIntoPlaylist` | an existing playlistId to insert the new video into after upload | string |
| `unlisted` | whether the new upload should be marked as unlisted; false = public (default: false) | boolean |

_* = required_

[example](examples/upload-test.ts)
```js
import { Source, YoutubeUploader } from '@hemul/reuploader';
import token from './.token.json' assert { type: 'json' };

const exampleFileStream = Source.getFileStream({ path: './examples/test_video.mp4' });

const uploader = new YoutubeUploader({
    token,
    client_id: process.env.YOUTUBE_CLIENT_ID!,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
});

logger.debug('Starting upload');
const { videoUrl } = await uploader.upload({
    title: 'Test Video',
    description: 'test video description',
    source: exampleFileStream,
    insertIntoPlaylist: '<playlist id>',
    unlisted: true
});
logger.debug('Upload complete: ' + videoUrl);
```