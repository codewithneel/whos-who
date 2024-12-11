import { Component, OnInit } from '@angular/core';
import fetchFromSpotify from 'src/services/api';
import { GameConfigService } from 'src/services/gameConfig';
import { Router } from '@angular/router';
import { ScoreService } from 'src/services/scoreService';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  token: string = 'BQC5JVgrh6mPZqtuW06-IimqSEmCxY8sHPwzCIQEOH4oevXpUuJqugIBBTPLAmClBHQ_u-turVwrZ9WQTq0d-6MtNPKV3r_qATQ298v9Rp_h5D_n34U';
  artists: any[] = [];
  prevUsed: Set<number> = new Set<number>();
  isGameStarted: boolean = false;
  gameOver: boolean = false;
  image: string = '';
  options: Set<string> = new Set<string>();
  shuffledOptions: string[] = [];
  answer: string = '';
  score: number = 0;

  constructor(
      private gameConfigService: GameConfigService,
      private router: Router,
      private scoreService: ScoreService
  ) {}

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
    console.log('Answer:', this.answer);
    console.log('Options:', this.options);
  }

  checkAnswer(selectedAnswer: string): void {
    if (selectedAnswer !== this.answer) {
      this.scoreService.setScore(this.score);
      this.endGame();
    } else {
      this.score += 1;
      if (this.score >= 40) {
        this.scoreService.setScore(this.score);
        this.endGame();
      } else {
        this.game();
      }
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
      this.image = 'default_image_url'; // Replace with a placeholder image URL if no image is available
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

  ngOnInit(): void {
    this.gameConfigService.genre.subscribe(state => {
      this.fetchArtistsByGenre(state)
          .then(response => {
            this.artists = response.artists.items;
          })
          .catch(error => {
            console.error('Error fetching artists:', error);
          });
    });
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
