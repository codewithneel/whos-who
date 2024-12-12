import { Injectable } from '@angular/core';
import fetchFromSpotify from './api';

@Injectable({
    providedIn: 'root',
})
export class BackgroundService {
    private token: string = 'BQCZWzoSgBG8TdIJCP41YfUx4B8gzAPNXTWqENgxTp_ajO65JWfBj3W28NxPlT97bdY622r0LuU07AhKRIq5a_HK7mXlIlHuBNvLrN6RLy4n5dejskM';
    private albumCovers: string[] = [];

    constructor() {}

    async fetchAlbumCoversByGenre(genre: string): Promise<string[]> {
        if (this.albumCovers.length > 0) {
            return this.albumCovers;
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