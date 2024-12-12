import { Injectable } from '@angular/core';
import fetchFromSpotify from './api';

@Injectable({
    providedIn: 'root',
})
export class BackgroundService {
    private token: string = 'BQDrVdBuo46SE0g00hsqfg--Gu1ExMqdG1P_O8IlTeHjIIrYNMd3fV_7c4TCNz_dPr06HPSKsgXqzpvYcxaWyshFLCBEg8JG_BKGJknrCZe-xKKeIWE';
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