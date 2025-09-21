// Jamendo API client (v3.0)
// Fetches full tracks (mp32) with cover images and share links.

import type { JamendoApiResponse, JamendoTrackApi } from '@/types/jamendo';
import type { Track } from '@/types/player';

const BASE = 'https://api.jamendo.com/v3.0';
const CLIENT_ID:string = 'bc6dce30';

if (!CLIENT_ID) {
    // eslint-disable-next-line no-console
    console.warn(
        '[Jamendo] Missing VITE_JAMENDO_CLIENT_ID. Create .env and set your client id.'
    );
}

export interface SearchResult {
    items: Track[];
    total?: number; // not always reliable, Jamendo returns headers.results_count
}

/**
 * Map Jamendo API track to internal Track type
 */
function mapTrack(t: JamendoTrackApi): Track {
    return {
        id: t.id,
        title: t.name,
        artist: t.artist_name,
        album: t.album_name,
        image:
            t.image ||
            t.album_image ||
            'https://cdn.jamendo.com/img/no-album-cover.jpg',
        audioUrl: t.audio,
        shareUrl: t.shareurl || t.shorturl || t.albumnurl || t.album_shareurl,
        albumShareUrl: t.album_shareurl,
        duration: t.duration ?? undefined,
        source: 'Jamendo',
    };
}

/**
 * Search tracks by name/artist.
 * @param query Free text (name/artist)
 * @param page 1-based page index
 * @param size page size
 */
export async function searchTracks(
    query: string,
    page = 1,
    size = 20
): Promise<SearchResult> {
    const offset = (page - 1) * size;
    const url = new URL(`${BASE}/tracks`);
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('format', 'json');
    url.searchParams.set('namesearch', query);
    url.searchParams.set('limit', String(size));
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('audioformat', 'mp32');
    url.searchParams.set('include', 'musicinfo+stats');
    url.searchParams.set('imagesize', '200');

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Jamendo HTTP ${res.status}`);
    }
    const data = (await res.json()) as JamendoApiResponse<JamendoTrackApi>;
    if (data.headers.status !== 'success') {
        throw new Error(
            `Jamendo API error: ${data.headers.code} ${data.headers.error_message ?? ''}`.trim()
        );
    }
    const items = data.results.map(mapTrack);
    return { items, total: data.headers.results_count };
}
