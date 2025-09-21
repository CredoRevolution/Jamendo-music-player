export interface JamendoHeaders {
    status: 'success' | 'failed';
    code: number;
    error_message?: string;
    results_count?: number;
}

export interface JamendoApiResponse<T> {
    headers: JamendoHeaders;
    results: T[];
}

export interface JamendoTrackApi {
    id: string;
    name: string;
    artist_name: string;
    album_name: string;
    audio: string; // mp32 stream
    image?: string;
    album_image?: string;
    duration?: number;
    shareurl?: string;
    shorturl?: string;
    album_shareurl?: string;
    albumnurl?: string;
}
