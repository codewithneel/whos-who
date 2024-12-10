import { Component, OnInit } from '@angular/core';
import fetchFromSpotify from 'src/services/api'
import { GameConfigService } from 'src/services/gameConfig';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  
  token = "BQD-9jY_DS60r7KnHbX-A2rCrbGuibNHxV1SZOeOJulyqQ-FYipuA_E_LRHe98sR3W9m7wnXNpG1KnvC2ReSh8YN4FEjMP6-lrZuovFC69UYmbFWWzY"

  constructor(private gameConfigService : GameConfigService){}

  /*
   * IMPORTANT!!! : Generate token on Spotify API (neel)
   * curl -X POST "https://accounts.spotify.com/api/token" \
   * -H "Content-Type: application/x-www-form-urlencoded" \
   * -d "grant_type=client_credentials&client_id=c2e0629a0a80434d9f1560bf93dbee43&client_secret=423ccebde713442fa82b88e63a223ba7"
   */

  getAlbumsByGenre = (genre : string) => fetchFromSpotify({
    token: this. token,
    endpoint: 'search',
    params: {
      q: `genre:"${genre}"`,
      type: "album",
      limit: "1"
    }
  })
  // getArtistId = () => fetchFromSpotify({
  //   token: this. token,
  //   endpoint: 'search',
  //   params: {
  //     q:"Eminem", 
  //     type:"artist", 
  //     limit:"1"}
  // })

  ngOnInit(): void {
    // this.search().then((response) => console.log(response.artists.items[0].id))
    // this.gameConfigService.genre.subscribe( () => this.gameConfigService.updateGenre("hip hop"))
    // this.gameConfigService.genre.subscribe(state => console.log(state))
    this.gameConfigService.genre.subscribe(state => {
      this.getAlbumsByGenre(state).
      then(response => console.log(response))
    })
  }

}
