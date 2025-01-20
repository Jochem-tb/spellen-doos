import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GameTutorialService } from './gameTutorial.service';

@Component({
  selector: 'lib-game-tutorial',
  standalone: false,
  templateUrl: './gameTutorial.component.html',
  styleUrl: './gameTutorial.component.css',
})
export class GameTutorialComponent implements OnInit{
  tutorialContent = 'Aan het laden...'; // Default content while loading
  gameTitle = '' // Default content while loading
  gameId = '';
  gamePicture = '';

  constructor(
    private router: Router,
    private gameTutorialService: GameTutorialService
  ) {}

  ngOnInit(): void {
    console.log('URL:', this.router.url);
    this.gameId = this.router.url.split('/')[2];
    console.log('GameID:', this.gameId);
    this.loadGame();
  }

  loadGame() {
    this.gameTutorialService.getGameContent(this.gameId).subscribe({
      next: (results) => {
        this.gameTitle = results.name;
        this.gamePicture = results.cardImage;
        this.tutorialContent = results.tutorialContent ?? 'Dit spel bezit geen uitleg, maar is wel leuk om te spelen!';
      },
      error: (err) => console.error('Error loading game content', err),
      complete: () => console.log('Game content loaded')
    });    
  }
}
