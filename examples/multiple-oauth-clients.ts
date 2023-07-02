import { YoutubeUploader } from '../src/uploader/youtube-uploader.js';
import logger from './logging.js';

import token from '../.token.json' assert { type: 'json' };

const uploader = new YoutubeUploader({
    token,
    client_id: process.env.YOUTUBE_CLIENT_ID!,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
});

const uploader2 = new YoutubeUploader({
    token,
    client_id: process.env.YOUTUBE_CLIENT_ID!,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
});


logger.debug('uploader1 token: ' + JSON.stringify(await uploader.getToken(), null, 2));
logger.debug('uploader2 token: ' + JSON.stringify(await uploader2.getToken(), null, 2));

const res2: any = await uploader2.listVideosTest();
const res: any = await uploader.listVideosTest();

logger.debug('uploader1 res: ' + res.data.items[0].id);
logger.debug('uploader2 res: ' + res2.data.items[0].id);