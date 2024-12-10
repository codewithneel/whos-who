import { Component, OnInit } from '@angular/core';
import fetchFromSpotify from 'src/services/api'
import { GameConfigService } from 'src/services/gameConfig';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  
  token = "BQBnUWXILOBugMdi0BgCU2XBOBluoisXQXuWP49QBQlE-OYWGlb2RS7QCD_S2QuWN6iOXBkJu89veba26Q14_FB-RMtXMyv37Dj98vaRfDsxgDVn9Gg"
  artists = []
  prevUsed = new Set<number>()
  isGameStarted = false
  gameOver = false
  image = ""
  options = new Set<string>()
  shuffledOptions: string[] = []
  answer = ""
  score = 0;

  constructor(private gameConfigService : GameConfigService){}

  /*
   * IMPORTANT!!! : Generate token on Spotify API (neel)
   * curl -X POST "https://accounts.spotify.com/api/token" \
   * -H "Content-Type: application/x-www-form-urlencoded" \
   * -d "grant_type=client_credentials&client_id=c2e0629a0a80434d9f1560bf93dbee43&client_secret=423ccebde713442fa82b88e63a223ba7"
   */

  fetchArtistsByGenre = (genre : string) => fetchFromSpotify({
    token: this.token,
    endpoint: 'search',
    params: {
      q: `genre:"${genre}"`,
      type: "artist",
      limit: "50"
    }
  })

  startGame(){
    this.isGameStarted = true
    this.game()
  }

  game(){
    this.options.clear()
    this.generateArtistToDisplay()
    this.generateOptions()
    console.log(this.answer)
    console.log(this.options)
  }

  checkAnswer(selectedAnswer: string){
    if(selectedAnswer != this.answer) this.gameOver = true
    else {
      this.score += 1
      this.score === 40 ? this.gameOver = true : this.game()
    }
  }

  generateArtistToDisplay(){
    let randomIndex = Math.floor(Math.random() * 50)
    while (this.prevUsed.has(randomIndex)){
      randomIndex = Math.floor(Math.random() * 50)
    }
    this.prevUsed.add(randomIndex)
    this.answer = this.artists[randomIndex]["name"]
    this.options.add(this.answer)
    this.image = this.artists[randomIndex]["images"][0]["url"]
  }

  generateOptions(){
    for(let i = 1; i<=3; i++){
      let randomIndex = Math.floor(Math.random() * 50)
      while (this.options.has(this.artists[randomIndex]["name"])){
        randomIndex = Math.floor(Math.random() * 50)
      }
      this.options.add(this.artists[randomIndex]["name"])
    }
    this.shuffle()
  }

  shuffle(){
    this.shuffledOptions = [...this.options]
    for (let i = this.shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledOptions[i], this.shuffledOptions[j]] = [this.shuffledOptions[j], this.shuffledOptions[i]];
    }
  }
  
  ngOnInit(): void {
    this.gameConfigService.genre.subscribe(state => {
      this.fetchArtistsByGenre(state)
      .then(response => {this.artists = response.artists.items})
      .then()
    })
  }

}
