import { google, youtube_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { UploadRequest, UploadResult, UploaderBase } from "./base-uploader.js";

export interface YoutubeUploaderAuth {
    token: any;
    client_id: string;
    client_secret: string;
}

export interface YoutubeUploadRequest extends UploadRequest {
    title: string;
    description: string;
    unlisted?: boolean;
    insertIntoPlaylist?: string;
}

export interface YoutubeUploadResult extends UploadResult {
    id: string;
    videoUrl: string;
}

// export class YoutubeUploader extends Uploader {
export class YoutubeUploader extends UploaderBase {
    readonly youtube: youtube_v3.Youtube; 
    readonly oauth2Client: OAuth2Client;

    constructor(auth: YoutubeUploaderAuth) {
        super();
        this.oauth2Client = new google.auth.OAuth2(auth.client_id, auth.client_secret, "http://localhost");
        this.oauth2Client.setCredentials(auth.token);
        this.youtube = google.youtube({ version: 'v3', auth: this.oauth2Client});
    }

    async getToken() {
        return (await this.oauth2Client.getAccessToken()).res?.data;
    }

    async insertVideo(req: YoutubeUploadRequest) {
        const res = await this.youtube.videos.insert({
            part: ['id,snippet,status'],
            requestBody: {
                snippet: {
                    title: req.title,
                    description: req.description,
                    defaultLanguage: 'en',
                    defaultAudioLanguage: 'en'
                },
                status: {
                    privacyStatus: req.unlisted ? 'unlisted' : 'public'
                },
            },
            media: {
                body: req.source
            },
        });
        return res.data.id;
    }

    async insertVideoIntoPlaylist(videoId: string, playlistId: string) {
        return this.youtube.playlistItems.insert({
            part: ['id,snippet'],
            requestBody: {
                snippet: {
                    playlistId: playlistId,
                    resourceId: { kind: 'youtube#video', videoId }
                }
            }
        });
    }

    async upload(req: YoutubeUploadRequest): Promise<YoutubeUploadResult> {
        // Upload the video
        const videoId = await this.insertVideo(req);
        if (!videoId) {
            throw new Error('Failed to insert video');
        }

        if (req.insertIntoPlaylist) {
            // Check if the playlist exists
            let res = await this.youtube.playlists.list({
                part: ['id'],
                id: [req.insertIntoPlaylist]
            }) 

            // Insert into the playlist
            if (res.data.items?.length) {
                await this.insertVideoIntoPlaylist(videoId, req.insertIntoPlaylist)
            }
        }

        return {
            id: videoId,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`
        };
    }
}