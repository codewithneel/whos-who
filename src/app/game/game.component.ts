import { Component, OnInit } from '@angular/core';
import fetchFromSpotify from 'src/services/api';
import { GameConfigService } from 'src/services/gameConfig';
import { Router } from '@angular/router';
import { ScoreService } from 'src/services/scoreService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BackgroundService } from 'src/services/backgroundService'; // Import the background service

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  token: string = "BQCZWzoSgBG8TdIJCP41YfUx4B8gzAPNXTWqENgxTp_ajO65JWfBj3W28NxPlT97bdY622r0LuU07AhKRIq5a_HK7mXlIlHuBNvLrN6RLy4n5dejskM";
  artists: any[] = [];
  backgroundImages: string[] = [];
  prevUsed: Set<number> = new Set<number>();
  isGameStarted: boolean = false;
  gameOver: boolean = false;
  image: string = '';
  options: Set<string> = new Set<string>();
  shuffledOptions: string[] = [];
  answer: string = '';
  score: number = 0;
  apiResponseSuccess: boolean = false;
  check: boolean = false;
  selectedAnswer: string = "";
  playlists : {[key:string]: string} = {
    "House": "https://open.spotify.com/embed/playlist/37i9dQZF1DX2TRYkJECvfC?utm_source=generator",
    "Alternative": "https://open.spotify.com/embed/playlist/1XQ08TC685gyf3BIXzhmTh?utm_source=generator",
    "J-Rock": "https://open.spotify.com/embed/playlist/37i9dQZF1EIhJROHjsowE8?utm_source=generator",
    "R&B": "https://open.spotify.com/embed/playlist/37i9dQZF1EQoqCH7BwIYb7?utm_source=generator",
    "Rock": "https://open.spotify.com/embed/playlist/1ti3v0lLrJ4KhSTuxt4loZ?utm_source=generator",
    "Pop": "https://open.spotify.com/embed/playlist/1WH6WVBwPBz35ZbWsgCpgr?utm_source=generator",
    "Rap":"https://open.spotify.com/embed/playlist/4n2ikSftK0aQban4IFPqU6?utm_source=generator",
    "Hip-Hop": "https://open.spotify.com/embed/playlist/0dMexqq0XIWS3QJ74z3ZhD?utm_source=generator",
    "Jazz": "https://open.spotify.com/embed/playlist/37i9dQZF1DXbITWG1ZJKYt?utm_source=generator",
  }
  playlist: SafeResourceUrl | undefined;

  constructor(
      private gameConfigService: GameConfigService,
      private router: Router,
      private scoreService: ScoreService,
      private sanitizer: DomSanitizer,
      private backgroundService: BackgroundService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Fetch playlist and artist data as before
      this.gameConfigService.genre.subscribe(state => {
        this.playlist = this.sanitizer.bypassSecurityTrustResourceUrl(this.playlists[state]);
        this.fetchArtistsByGenre(state)
            .then(response => {
              this.artists = response.artists.items;
              this.apiResponseSuccess = true;
              this.loadBackgroundImages(state);
            })
            .catch(error => {
              console.error('Error fetching artists:', error);
            });
      });
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }

  async loadBackgroundImages(genre: string): Promise<void> {
    try {
      // Fetch album covers or background images based on genre
      const albumCovers = await this.backgroundService.fetchAlbumCoversByGenre(genre);
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
    }, 3000);
  }

  startGame(): void {
    this.isGameStarted = true;
    this.game();
  }

  game(): void {
    if (this.artists.length === 0) {
      console.error('No artists found. Make sure the genre is valid and data is fetched correctly.');
      return;
    }

    this.options.clear();
    this.generateArtistToDisplay();
    this.generateOptions();
  }

  checkAnswer(selectedAnswer: string): void {
    this.check = true;
    this.selectedAnswer = selectedAnswer;
    if (selectedAnswer !== this.answer) {
      setTimeout(() => {
        this.scoreService.setScore(this.score);
        this.endGame();
      }, 1500);
    } else {
      setTimeout(() => {
        this.score += 1;
        if (this.score >= 40) {
          this.scoreService.setScore(this.score);
          this.endGame();
        } else {
          this.check = false;
          this.selectedAnswer = "";
          this.game();
        }
      }, 1000);
    }
  }

  endGame(): void {
    this.gameOver = true;
    this.router.navigate(['/result']);
  }

  generateArtistToDisplay(): void {
    let randomIndex = Math.floor(Math.random() * 50);
    while (this.prevUsed.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * 50);
    }
    this.prevUsed.add(randomIndex);

    const artist = this.artists[randomIndex];
    this.answer = artist['name'];
    this.options.add(this.answer);

    if (artist['images'] && artist['images'][0]) {
      this.image = artist['images'][0]['url'];
    } else {
      this.image = 'default_image_url';
    }
  }

  generateOptions(): void {
    for (let i = 1; i <= 3; i++) {
      let randomIndex = Math.floor(Math.random() * 50);
      while (this.options.has(this.artists[randomIndex]['name'])) {
        randomIndex = Math.floor(Math.random() * 50);
      }
      this.options.add(this.artists[randomIndex]['name']);
    }
    this.shuffleOptions();
  }

  shuffleOptions(): void {
    this.shuffledOptions = [...this.options];
    for (let i = this.shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledOptions[i], this.shuffledOptions[j]] = [this.shuffledOptions[j], this.shuffledOptions[i]];
    }
  }

  fetchArtistsByGenre = (genre: string) =>
      fetchFromSpotify({
        token: this.token,
        endpoint: 'search',
        params: {
          q: `genre:"${genre}"`,
          type: 'artist',
          limit: '50'
        }
      });
}

// curl -X POST "https://accounts.spotify.com/api/token" \
// -H "Content-Type: application/x-www-form-urlencoded" \
// -d "grant_type=client_credentials&client_id=c2e0629a0a80434d9f1560bf93dbee43&client_secret=423ccebde713442fa82b88e63a223ba7"