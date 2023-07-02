import got from "got";
import { Stream } from "stream";
import { createReadStream } from "fs";

export interface HTTPSourceRequest {
    url: string
    headers?: Record<string, string | string[] | undefined>;
}

export interface FileSourceRequest {
    path: string
}

export class Source {
    static getHttpStream(request: HTTPSourceRequest): Stream {
        return got.stream(request.url, { headers: request.headers });
    }
    static getFileStream(request: FileSourceRequest): Stream {
        return createReadStream(request.path);
    }
}
