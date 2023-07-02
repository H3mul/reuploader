import { Source, YoutubeUploader, YoutubeUploadRequest } from '../src/index.js';
import logger from './logging.js';

import token from '../.token.json' assert { type: 'json' };

// Test a read file stream
const exampleFileStream = Source.getFileStream({ path: './examples/test_video.mp4' });

// Test serving a video source from an HTTP stream:
// const exampleFileStream = Source.getHttpStream({
//     url: 'http://localhost:8080/test_video.mp4'
// })

const uploader = new YoutubeUploader({
    token,
    client_id: process.env.YOUTUBE_CLIENT_ID!,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
});

logger.debug('Starting upload');
await uploader.upload({
    title: 'Test Video',
    description: 'just a lil test video',
    source: exampleFileStream,
    insertIntoPlaylist: 'PL8hg-PSffFp_MPxCGxoHI95-TIiBMAHxm',
    unlisted: true
});