import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { GameComponent } from './game/game.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ResultComponent } from './result/result.component';
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "play", component: GameComponent},
  {path: "settings", component: SettingsComponent}, 
  {path: "leaderboard", component: LeaderboardComponent},
  { path: 'result', component: ResultComponent }

];

@NgModule({
  declarations: [AppComponent, NavbarComponent, HomeComponent, LeaderboardComponent, GameComponent, ResultComponent, SettingsComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
