import { Injectable } from '@angular/core';
import fetchFromSpotify from './api';

@Injectable({
    providedIn: 'root',
})
export class BackgroundService {
    private token: string = 'BQC6gTPz7tA82A3dSmY_YwuRpDvuXwEN6LwdT-wieUdtdYkdUTC5k6SjBl4J-01j3nRzOeeVUlBMpD9peH_NZyPz-e4_uQBHS4foIXfolzhVGn9fhiA';
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