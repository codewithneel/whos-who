import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboardService';
import { Player } from '../../services/leaderboardService';
import { BackgroundService } from 'src/services/backgroundService'; // Adjust path if necessary

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: Player[] = [];
  backgroundImages: string[] = [];

  constructor(
      private leaderboardService: LeaderboardService,
      private backgroundService: BackgroundService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Fetch leaderboard data
      this.leaderboard = this.leaderboardService.getLeaderboard();

      // Fetch album covers for the background
      const genre = 'pop'; // Example default genre for background
      const albumCovers = await this.backgroundService.fetchAlbumCoversByGenre(genre);

      // Initialize with six random images
      this.backgroundImages = albumCovers.slice(0, 6);
      this.startBackgroundRotation(albumCovers);
    } catch (error) {
      console.error('Error initializing leaderboard or background:', error);
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
}