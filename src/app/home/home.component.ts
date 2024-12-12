import { Component, OnInit } from '@angular/core';
import { BackgroundService } from 'src/services/backgroundService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  backgroundImages: string[] = [];
  rotationInterval: any;

  constructor(private backgroundService: BackgroundService) {}

  async ngOnInit(): Promise<void> {
    try {
      const genre = 'pop';
      const albumCovers = await this.backgroundService.fetchAlbumCoversByGenre(genre);


      this.backgroundImages = albumCovers.slice(0, 6);


      this.startImageRotation(albumCovers);
    } catch (error) {
      console.error('Error fetching background images:', error);
    }
  }

  startImageRotation(albumCovers: string[]): void {
    this.rotationInterval = setInterval(() => {
      if (albumCovers.length > 6) {
        const randomIndex = Math.floor(Math.random() * albumCovers.length);
        const replaceIndex = Math.floor(Math.random() * this.backgroundImages.length);

        // Replace one image in the array
        this.backgroundImages[replaceIndex] = albumCovers[randomIndex];
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }
}