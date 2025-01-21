import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RPSService } from './rps.service';
import { RPSChoicesEnum } from '@spellen-doos/shared/api';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'lib-rps',
  standalone: false,
  templateUrl: './rps.component.html',
  styleUrls: ['./rps.component.css'],
  animations: [
    trigger('slideIn', [
      state('hidden', style({ transform: 'translateX(-100%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
  
      transition('hidden => visible', [animate('0.5s ease-in-out')]),
      transition('visible => hidden', [animate('0.5s ease-in-out')]),
    ]),
    trigger('slideInOpponent', [
      state('hidden', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
  
      transition('hidden => visible', [animate('0.5s ease-in-out')]),
      transition('visible => hidden', [animate('0.5s ease-in-out')]),
    ]),
  ],
  
})
export class RpsComponent implements OnDestroy {
  RPSChoicesEnum = RPSChoicesEnum;

  choice?: RPSChoicesEnum;
  opponentChoice: string = '';
  score: number = 0;
  opponentScore: number = 0;

  timerTime: number = -1;

  winner: boolean = false;
  looser: boolean = false;
  draw: boolean = false;
  round: number = 0;

  userChoiceState: 'hidden' | 'visible' = 'hidden';
  opponentChoiceState: 'hidden' | 'visible' = 'hidden';

  isGameOver: boolean = false;

  private intervalId?: any;

  constructor(
    private rpsService: RPSService,
    private router: Router
  ) {
    this.rpsService.component = this;
  }

  ngOnDestroy(): void {
    this.rpsService.disconnect();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  changeChoice(newChoice: RPSChoicesEnum): void {
    if (this.choice === newChoice) {
      this.choice = undefined;
      this.userChoiceState = 'hidden';
      return;
    }
  
    if (this.choice && this.choice !== newChoice) {
      this.userChoiceState = 'hidden';
  
      setTimeout(() => {
        this.choice = newChoice;
        this.userChoiceState = 'visible';
        this.rpsService.changeChoice(newChoice);
      }, 500);
      return;
    }
  
    this.choice = newChoice;
    this.userChoiceState = 'visible';
    this.rpsService.changeChoice(newChoice);
  }
  
  

  disconnect(): void {
    this.rpsService.disconnect();
  }

  getImageUrl(choice: string): string {
    return `rps/${choice.toLowerCase()}.png`;
  }

  updateTimer(time: number): void {
    this.timerTime = time;

    if (time <= 0) {
      setTimeout(() => {
        this.resetRound();
      }, 5000);
    }
  }

  resetRound(): void {
    this.userChoiceState = 'hidden';
    this.opponentChoiceState = 'hidden';
  
    this.choice = undefined;
    this.opponentChoice = '';
  
    this.winner = false;
    this.looser = false;
    this.draw = false;
  
    this.timerTime = -1; 
  }
  

  updateScore(playerScore: number, opponentScore: number): void {
    this.score = playerScore;
    this.opponentScore = opponentScore;
  }

  showGameOverPopup(): void {
    this.isGameOver = true;
  }

  leaveGame(): void {
    this.rpsService.disconnect();
    this.router.navigate(['/dashboard']);
  }

  setData(data: Partial<Pick<this, 'choice' | 'opponentChoice' | 'score' | 'opponentScore' | 'timerTime' | 'winner' | 'looser' | 'round' | 'draw'>>): void {
    Object.assign(this, data);
    if (data.opponentChoice !== undefined) {
      this.opponentChoiceState = 'visible';
    }
    if (data.timerTime !== undefined) {
      this.updateTimer(data.timerTime);
    }
  }
}
