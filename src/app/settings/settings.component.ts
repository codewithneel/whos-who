import { Component, OnInit } from '@angular/core';
import { GameConfigService } from '../../services/gameConfig'; // Make sure to adjust the path according to your project structure

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  genres: string[] = ['House', 'Alternative', 'J-Rock', 'R&B', 'Rock', 'Pop', 'Hip-Hop', 'Jazz']; // You can extend this list
  selectedGenre: string = ''; // Default genre

  constructor(private gameConfigService: GameConfigService) { }

  ngOnInit(): void {
    // Optionally set a default genre from the global state if needed
    // this.selectedGenre = this.gameConfigService.getCurrentGenre();
  }

  onGenreChange(): void {
    // Update the genre in the global state (GameConfigService)
    this.gameConfigService.updateGenre(this.selectedGenre);
  }
}