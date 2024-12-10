import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboardService'; // Import the service

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  score: number = 0; // The score passed to the component
  playerName: string = '';

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit(): void {
    // Retrieves the score passed from previous component
    const storedScore = history.state.score;
    if (storedScore) {
      this.score = storedScore;
    }
  }

  submitScore(): void {
    if (this.playerName.trim() && this.score > 0) {
      // Only add the score if the name is not empty and the score is greater than 0
      const newPlayer = { name: this.playerName, score: this.score };
      this.leaderboardService.updateLeaderboard(newPlayer); // Update leaderboard via service

      // Optionally navigate to the leaderboard page
      // this.router.navigate(['/leaderboard']); // Uncomment to navigate to leaderboard
    } else {
      alert('Please enter your name and make sure your score is greater than 0');
    }
  }
}