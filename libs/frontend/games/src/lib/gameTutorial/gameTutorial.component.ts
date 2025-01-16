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
    this.loadTutorialMock();

    console.log('URL:', this.router.url);
    this.gameId = this.router.url.split('/')[2];
    console.log('GameID:', this.gameId);
  }

  loadTutorial(url: string) {
    this.tutorialContent = '<h5>Aan het laden...</h5>'; // Set loading state
    this.gameTutorialService.getHelpContent(url).subscribe({
      next: (results) => (
        (this.tutorialContent = results.content), (this.gameTitle = results.title)
      ),
      error: (err) => {
        console.error('Failed to load help content', err);
        this.tutorialContent =
          '<h3>Oeps.</h3><h5>Er is iets fout gegaan. Probeer het later nog een keer.</h5>';
        this.gameTitle = '';
      },
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
