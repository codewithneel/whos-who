import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboardService';
import { Router } from '@angular/router';
import { ScoreService } from 'src/services/scoreService';
import { BackgroundService } from 'src/services/backgroundService';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  score: number = 0;
  playerName: string = '';
  backgroundImages: string[] = [];

  constructor(
      private leaderboardService: LeaderboardService,
      private router: Router,
      private scoreService: ScoreService,
      private backgroundService: BackgroundService
  ) {}

  async ngOnInit(): Promise<void> {
    this.score = this.scoreService.getScore();
    if (this.score === undefined || this.score === null) {
      console.error('No score found. Redirecting to the game.');
    }

    try {
      const genre = 'pop'; // Example default genre for background
      const albumCovers = await this.backgroundService.fetchAlbumCoversByGenre(genre);

      // Initialize with six random images
      this.backgroundImages = albumCovers.slice(0, 6);
      this.startBackgroundRotation(albumCovers);
    } catch (error) {
      console.error('Error fetching background images:', error);
    }
  }

  startBackgroundRotation(albumCovers: string[]): void {
    setInterval(() => {
      if (albumCovers.length > 6) {
        const randomIndex = Math.floor(Math.random() * albumCovers.length);
        const replaceIndex = Math.floor(Math.random() * this.backgroundImages.length);

        // Replace one image
        this.backgroundImages[replaceIndex] = albumCovers[randomIndex];
      }
    }, 3000); // Rotate every 3 seconds
  }

  submitScore(): void {
    if (this.playerName.trim() && this.score > 0) {
      const newPlayer = { name: this.playerName, score: this.score };
      this.leaderboardService.updateLeaderboard(newPlayer);
      alert('Score submitted successfully!');
      this.router.navigate(['/leaderboard']);
    } else {
      alert('Please enter your name and make sure your score is greater than 0');
    }
  }
}
