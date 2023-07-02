import { Stream } from "stream";

export interface UploadRequest { source: Stream }
export interface UploadResult {}

export abstract class UploaderBase {
    // Upload the stream source to the destination and return a result object
    abstract upload(req: UploadRequest): Promise<UploadResult>;
    // Return any tokens for persistent storage
    abstract getToken(): Promise<any>;
}
