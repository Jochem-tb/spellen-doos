import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RPSService } from './rps.service';
import { RPSChoicesEnum } from '@spellen-doos/shared/api';

@Component({
  selector: 'lib-rps',
  standalone: false,
  templateUrl: './rps.component.html',
  styleUrls: ['./rps.component.css'],
})
export class RpsComponent implements OnDestroy {
  result: string = '';
  score: number = 0;
  opponentChoice: string = '';
  winnerMessage: string = '';
  showPopup: boolean = false;

  TIMER_TIME: number = 0;

  RPSChoicesEnum = RPSChoicesEnum;

  constructor(private renderer: Renderer2, private rpsService: RPSService) {
    this.rpsService.component = this;
  }
  ngOnDestroy(): void {
    this.rpsService.disconnect();
  }

  changeChoice(choise: RPSChoicesEnum): void {
    console.log(`ChangeChoice in rpsCOmponent: ${choise}`);
    this.rpsService.changeChoice(choise);
  }

  public updateTimer(time: number): void {
    this.TIMER_TIME = time;
  }

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
