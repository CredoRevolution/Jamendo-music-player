import { defineStore } from 'pinia';
import type { Track } from '@/types/player';
import { getJSON, setJSON } from '@/services/storage';

const FKEY = 'mp_favorites_v1';
const PKEY = 'mp_playlists_v1';

type TrackMeta = { id: string; title: string; artist: string; image?: string };

type Playlist = { id: string; name: string; trackIds: string[] };

export const useLibraryStore = defineStore('library', {
    state: () => ({
        favorites: {} as Record<string, TrackMeta>,
        playlists: {} as Record<string, Playlist>,
    }),
    actions: {
        load() {
            this.favorites = getJSON(FKEY, {});
            this.playlists = getJSON(PKEY, {});
        },
        save() {
            setJSON(FKEY, this.favorites);
            setJSON(PKEY, this.playlists);
        },
        isFavorite(id: string) {
            return !!this.favorites[id];
        },
        toggleFavorite(track: Track) {
            if (this.isFavorite(track.id)) delete this.favorites[track.id];
            else
                this.favorites[track.id] = {
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                    image: track.image,
                };
            this.save();
        },
        createPlaylist(name: string) {
            const id = crypto.randomUUID();
            this.playlists[id] = { id, name, trackIds: [] };
            this.save();
            return id;
        },
        renamePlaylist(id: string, name: string) {
            if (this.playlists[id]) this.playlists[id].name = name;
            this.save();
        },
        addToPlaylist(id: string, track: Track) {
            const p = this.playlists[id];
            if (p && !p.trackIds.includes(track.id)) p.trackIds.push(track.id);
            this.save();
        },
        removeFromPlaylist(id: string, trackId: string) {
            const p = this.playlists[id];
            if (p) p.trackIds = p.trackIds.filter((x) => x !== trackId);
            this.save();
        },
    },
});
