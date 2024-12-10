import { Injectable } from '@angular/core';

export interface Player {  // Define Player interface
    name: string;
    score: number;
}

@Injectable({
    providedIn: 'root'
})
export class LeaderboardService {
    private players: Player[] = [
        { name: 'Alice', score: 0 },
        { name: 'Bob', score: 0 },
        { name: 'Charlie', score: 0 },
        { name: 'David', score: 0 },
        { name: 'Eve', score: 0 }
    ];

    constructor() { }

    // Retrieve the current leaderboard
    getLeaderboard(): Player[] {
        return this.players;
    }

    // Add a new player to the leaderboard and keep the top 5
    updateLeaderboard(newPlayer: { name: string; score: number }): void {
        this.players.push(newPlayer);
        this.players.sort((a, b) => b.score - a.score); // Sort by score descending
        this.players = this.players.slice(0, 5); // Keep only the top 5 players
    }
}