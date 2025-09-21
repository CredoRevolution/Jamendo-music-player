export type RepeatMode = 'off' | 'one' | 'all';

export type Track = {
    id: string;
    title: string;
    artist: string;
    album?: string | null;
    image?: string | null;
    audioUrl: string;
    shareUrl?: string | null;
    albumShareUrl?: string | null;
    duration?: number;
    source: 'Jamendo';
};
