import { Component } from '@angular/core';
import { RPSService } from './rps.service';
import { RPSChoicesEnum } from '@spellen-doos/shared/api';

@Component({
  selector: 'lib-rps',
  standalone: false,
  templateUrl: './rps.component.html',
  styleUrls: ['./rps.component.css'],
})
export class RpsComponent {
  choice?: RPSChoicesEnum = undefined;
  opponentChoice: string = '';
  score: number = 0;
  opponentScore: number = 0;
  timerTime: number = 0;
  winner: boolean = false;
  looser: boolean = false;
  round: number = 1;

  RPSChoicesEnum = RPSChoicesEnum;


  constructor(private rpsService: RPSService) {
    // Koppel deze component aan de service (zodat de service kan updaten).
    console.log('[DEBUG] RPS Component constructor...');
    this.rpsService.component = this;
  }

  changeChoice(choice: RPSChoicesEnum): void {
    if (this.choice === choice) {
      this.choice = undefined;
      return;
    }

    // Nieuwe keuze doorgeven
    this.choice = choice;
    this.rpsService.changeChoice(choice as RPSChoicesEnum);
  }

  disconnect(): void {
    console.log('[DEBUG] Disconnecting...');
    this.rpsService.disconnect();
  }

  getImageUrl(choice: string): string {
    choice = choice.toLowerCase();
    return `rps/${choice}.png`;
  }

  // Timer-update binnenkrijgen vanuit de service
  updateTimer(time: number): void {
    this.timerTime = time;
  }

  // Score bijwerken vanuit de service
  updateScore(playerScore: number, opponentScore: number): void {
    this.score = playerScore;
    this.opponentScore = opponentScore;
  }

  // Data van de service (socket) direct naar de component doorzetten
  setData(data: {
    choice?: RPSChoicesEnum;
    opponentChoice?: string;
    score?: number;
    opponentScore?: number;
    timerTime?: number;
    winner?: boolean;
    looser?: boolean;
  }): void {
    console.log('[DEBUG] setData aangeroepen met:', data);
  
    if (data.choice !== undefined) {
      this.choice = data.choice;
    }
    if (data.opponentChoice !== undefined) {
      this.opponentChoice = data.opponentChoice;
    }
    if (data.score !== undefined) {
      this.score = data.score;
    }
    if (data.opponentScore !== undefined) {
      this.opponentScore = data.opponentScore;
    }
    if (data.timerTime !== undefined) {
      this.timerTime = data.timerTime;
    }
    if (data.winner !== undefined) {
      this.winner = data.winner;
      console.log('[DEBUG] Winner updated:', this.winner);
    }
    if (data.looser !== undefined) {
      this.looser = data.looser;
      console.log('[DEBUG] Looser updated:', this.looser);
    }
  }  

  // Popup sluiten
  closePopup(): void {
    this.winner = false;
    this.looser = false;
    this.choice = undefined;
  }
}
