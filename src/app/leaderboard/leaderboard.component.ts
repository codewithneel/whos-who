import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  players = [
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 },
    { name: 'Player 3', score: 0 },
    { name: 'Player 4', score: 0 },
    { name: 'Player 5', score: 0 }
  ];

  constructor() {}

  ngOnInit(): void {}

  /**
   * Placeholder function for adding/updating scores
   * Future implementation will update the leaderboard based on gameplay results
   */
  updateLeaderboard(newPlayer: { name: string; score: number }) {
    this.players.push(newPlayer);
    this.players.sort((a, b) => b.score - a.score); // Sort by score descending
    this.players = this.players.slice(0, 5); // Keep only the top 5 players
  }
}
