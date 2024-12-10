import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
    providedIn: 'root'
})

export class GameConfigService{
    private genreState = new BehaviorSubject<string>("rap")
    public genre = this.genreState.asObservable()

    constructor(){}

    updateGenre(genre: string){
        this.genreState.next(genre)
    }
}