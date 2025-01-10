import { Component, OnInit, Renderer2 } from '@angular/core';
import { RPSService } from './rps.service';

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

  constructor(private renderer: Renderer2, private rpsService: RPSService) {}

  play(choice: string): void {
    console.log(`[DEBUG] Player choice: ${choice}`);

    const buttons = document.querySelectorAll('.rps-button');
    buttons.forEach((button) => this.renderer.removeClass(button, 'selected'));

    const button = document.querySelector(`.rps-button.${choice}`);
    if (button) {
      this.renderer.addClass(button, 'selected');
      console.log(`[DEBUG] Selected button: ${choice}`);
    } else {
      console.error(`[ERROR] Button not found for choice: ${choice}`);
    }

    this.opponentChoice = this.getOpponentChoice();
    console.log(`[DEBUG] Opponent choice: ${this.opponentChoice}`);

    this.result = this.determineWinner(choice, this.opponentChoice);
    this.showPopup = true;
  }

  getOpponentChoice(): string {
    const choices = ['steen', 'papier', 'schaar'];
    const choice = choices[Math.floor(Math.random() * choices.length)];
    console.log(`[DEBUG] Opponent randomly selected: ${choice}`);
    return choice;
  }

  determineWinner(playerChoice: string, opponentChoice: string): string {
    if (playerChoice === opponentChoice) {
      console.log('[DEBUG] It is a draw');
      return 'Het is gelijkspel!';
    } else if (
      (playerChoice === 'steen' && opponentChoice === 'schaar') ||
      (playerChoice === 'papier' && opponentChoice === 'steen') ||
      (playerChoice === 'schaar' && opponentChoice === 'papier')
    ) {
      this.score++;
      console.log(`[DEBUG] Player wins! Current score: ${this.score}`);
      return 'Je hebt gewonnen!';
    } else {
      console.log('[DEBUG] Player loses');
      return 'Je hebt verloren!';
    }
  }

  closePopup(): void {
    this.showPopup = false;
    console.log('[DEBUG] Popup closed');
    
    const buttons = document.querySelectorAll('.rps-button');
    buttons.forEach((button) => this.renderer.removeClass(button, 'selected'));
  }
}
