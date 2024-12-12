import { Component, OnInit } from '@angular/core';
import { GameConfigService } from '../../services/gameConfig';
import { BackgroundService } from 'src/services/backgroundService'; // Adjust path as necessary

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  genres: string[] = ['House', 'Alternative', 'J-Rock', 'R&B', 'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Rap'];
  selectedGenre: string = '';
  backgroundImages: string[] = [];

  constructor(
      private gameConfigService: GameConfigService,
      private backgroundService: BackgroundService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const genre = 'pop'; // Example default genre for background
      const albumCovers = await this.backgroundService.fetchAlbumCoversByGenre(genre);

      // Initialize with six random images
      this.backgroundImages = albumCovers.slice(0, 6);
      this.startBackgroundRotation(albumCovers);
    } catch (error) {
      console.error('Error loading background images:', error);
    }
  }

  onGenreChange(): void {
    this.gameConfigService.updateGenre(this.selectedGenre);
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