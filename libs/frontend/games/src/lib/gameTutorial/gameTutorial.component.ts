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
  gamePicture = 'https://www.leukebordspellen.nl/wp-content/uploads/2022/09/steen-papier-schaar-3.jpg';

  constructor(
    private router: Router,
    private gameTutorialService: GameTutorialService
  ) {}

  ngOnInit(): void {
    // Listen for route changes
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.loadTutorial(this.router.url);
    //   }
    // });
    console.log('URL:', this.router.url);
    this.gameId = this.router.url.split('/')[2];
    console.log('GameID:', this.gameId);
    this.loadGame();
    this.loadTutorialMock();
  }

  loadGame() {
    this.gameTutorialService.getGameContent(this.gameId).subscribe({
      next: (results) => {
        this.gameTitle = results.name;
        this.gamePicture = results.cardImage;
      },
      error: (err) => console.error('Error loading game content', err),
      complete: () => console.log('Game content loaded')
    });    
  }

  loadTutorialMock() {
    console.log('Loading mock tutorial content');
    this.gameTutorialService.getHelpContentMock('mock').subscribe({
      next: (results) => {
        this.tutorialContent = results;
        this.gameTitle = 'Steen Papier Schaar'; // Voeg een mock titel toe als je dat wilt
      },
      error: (err) => console.error('Error loading tutorial content', err),
      complete: () => console.log('Tutorial content loaded')
    });
  }
}
