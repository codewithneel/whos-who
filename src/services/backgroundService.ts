import { Injectable } from '@angular/core';
import fetchFromSpotify from './api';

@Injectable({
    providedIn: 'root',
})
export class BackgroundService {
    private token: string = 'BQB_WK9sFurwchZjhTXOmZ-YTJ2Yck5Q6QFz4unhbV4OzGG6K8Uxl4ceNiY52sA8HIVfC3grM9VvdQwx4V6TNEwCE1qtmFN-rOwuZ-_cLVTDiUQMQeM';
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