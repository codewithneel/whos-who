import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboardService'; // Import the service
import { Router } from '@angular/router';
import { ScoreService } from 'src/services/scoreService';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  score: number = 0; // The score passed to the component
  playerName: string = '';

  constructor(private leaderboardService: LeaderboardService, private router: Router, private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.score = this.scoreService.getScore();
    if (this.score === undefined || this.score === null) {
      console.error('No score found. Redirecting to the game.');
    }
  }

  submitScore(): void {
    if (this.playerName.trim() && this.score > 0) {
      // Only add the score if the name is not empty and the score is greater than 0
      const newPlayer = { name: this.playerName, score: this.score };
      this.leaderboardService.updateLeaderboard(newPlayer); // Update leaderboard via service

      alert('Score submitted successfully!');

      // Optionally navigate to the leaderboard page
      this.router.navigate(['/leaderboard']);
    } else {
      alert('Please enter your name and make sure your score is greater than 0');
    }
  }
}
