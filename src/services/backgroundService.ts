import { Injectable } from '@angular/core';
import fetchFromSpotify from './api';

@Injectable({
    providedIn: 'root',
})
export class BackgroundService {
    private token: string = 'BQBM7pl7QMQzzmOYmm3uLiAoe04Nq5Ubnr0qmPnATG6ko4754oExb8gjFQkdJwXEKGW97ZYCM2taT9fL7WIbuEfkqau0IUOHbsbsNXMmb_O_PU0dI2I';
    private albumCovers: string[] = [];

    constructor() {}

    async fetchAlbumCoversByGenre(genre: string): Promise<string[]> {
        if (this.albumCovers.length > 0) {
            return this.albumCovers; // Return cached results
        }

        try {
            const response = await fetchFromSpotify({
                token: this.token,
                endpoint: 'search',
                params: {
                    q: `genre:"${genre}"`,
                    type: 'artist',
                    limit: '50',
                },
            });

            this.albumCovers = response.artists.items
                .filter((artist: any) => artist.images && artist.images[0])
                .map((artist: any) => artist.images[0].url);

            return this.albumCovers;
        } catch (error) {
            console.error('Error fetching album covers:', error);
            return [];
        }
    }
}