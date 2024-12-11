import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ScoreService {
    private currentScore: number = 0;

    setScore(score: number): void {
        this.currentScore = score;
    }

    getScore(): number {
        return this.currentScore;
    }
}