import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'lib-rps',
  standalone: false,
  templateUrl: './rps.component.html',
  styleUrls: ['./rps.component.css'],
})
export class RpsComponent {
  result: string = '';
  score: number = 0;
  opponentChoice: string = '';
  winnerMessage: string = '';
  showPopup: boolean = false;

  constructor(private renderer: Renderer2) {}

  play(choice: string): void {
    // Reset previous button state
    const buttons = document.querySelectorAll('.rps-button');
    buttons.forEach((button) => this.renderer.removeClass(button, 'selected'));

    // Highlight the selected button
    const button = document.querySelector(`.rps-button.${choice}`);
    if (button) {
      this.renderer.addClass(button, 'selected');
    }

    // Update game logic
    this.result = `Jouw keuze is ${choice}`;
    this.opponentChoice = `De tegenstander koos ${this.getOpponentChoice()}`;
    const winner = this.determineWinner(choice, this.opponentChoice);

    // Show the popup with the result
    this.winnerMessage = winner;
    this.showPopup = true;
  }

  getOpponentChoice(): string {
    const choices = ['steen', 'papier', 'schaar'];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  determineWinner(playerChoice: string, opponentChoice: string): string {
    if (playerChoice === opponentChoice) {
      return 'Het is gelijkspel!';
    } else if (
      (playerChoice === 'steen' && opponentChoice === 'schaar') ||
      (playerChoice === 'papier' && opponentChoice === 'steen') ||
      (playerChoice === 'schaar' && opponentChoice === 'papier')
    ) {
      this.score++;
      return 'Je hebt gewonnen!';
    } else {
      return 'Je hebt verloren!';
    }
  }

  closePopup(): void {
    this.showPopup = false;
    // Reset previous button state and remove the selected class
    const buttons = document.querySelectorAll('.rps-button');
    buttons.forEach((button) => this.renderer.removeClass(button, 'selected'));
  }
}
