import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboardService'; // Import the service
import { Player } from '../../services/leaderboardService'; // Import Player interface

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: Player[] = []; // Define leaderboard as an array of Player objects

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit(): void {
    this.leaderboard = this.leaderboardService.getLeaderboard(); // Get updated leaderboard
  }
}