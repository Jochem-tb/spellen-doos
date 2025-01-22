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
      state(RPSChoicesEnum.Hidden, style({ transform: 'translateX(-100%)', opacity: 0 })),
      state(RPSChoicesEnum.Visible, style({ transform: 'translateX(0)', opacity: 1 })),
  
      transition(`${RPSChoicesEnum.Hidden} => ${RPSChoicesEnum.Visible}`, [animate('0.5s ease-in-out')]),
      transition(`${RPSChoicesEnum.Visible} => ${RPSChoicesEnum.Hidden}`, [animate('0.5s ease-in-out')]),
    ]),
    trigger('slideInOpponent', [
      state(RPSChoicesEnum.Hidden, style({ transform: 'translateX(100%)', opacity: 0 })),
      state(RPSChoicesEnum.Visible, style({ transform: 'translateX(0)', opacity: 1 })),
  
      transition(`${RPSChoicesEnum.Hidden} => ${RPSChoicesEnum.Visible}`, [animate('0.5s ease-in-out')]),
      transition(`${RPSChoicesEnum.Visible} => ${RPSChoicesEnum.Hidden}`, [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class RpsComponent implements OnDestroy {
  RPSChoicesEnum = RPSChoicesEnum;

  roundActive = true

  choice?: RPSChoicesEnum;
  opponentChoice: string = '';
  score: number = 0;
  opponentScore: number = 0;

  timerTime: number = -1;

  winner: boolean = false;
  looser: boolean = false;
  draw: boolean = false;
  round: number = 0;

  userChoiceState: RPSChoicesEnum.Hidden | RPSChoicesEnum.Visible = RPSChoicesEnum.Hidden;
  opponentChoiceState: RPSChoicesEnum.Hidden | RPSChoicesEnum.Visible = RPSChoicesEnum.Hidden;

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
      this.userChoiceState = RPSChoicesEnum.Hidden;
      return;
    }
  
    if (this.choice && this.choice !== newChoice) {
      this.userChoiceState = RPSChoicesEnum.Hidden;
  
      setTimeout(() => {
        this.choice = newChoice;
        this.userChoiceState = RPSChoicesEnum.Visible;
        this.rpsService.changeChoice(newChoice);
      }, 500);
      return;
    }
  
    this.choice = newChoice;
    this.userChoiceState = RPSChoicesEnum.Visible;
    this.rpsService.changeChoice(newChoice);
  }

  disconnect(): void {
    console.log('[DEBUG] - Disconnecting from RPS game');
    this.rpsService.disconnect();
  }

  getImageUrl(choice: string): string {
    return `rps/${choice.toLowerCase()}.png`;
  }

  updateTimer(time: number): void {
    this.timerTime = time;

    if (time <= 0) {

      this.roundActive = false;

      setTimeout(() => {
        this.resetRound();
      }, 5000);
    }
  }

  resetRound(): void {
    this.userChoiceState = RPSChoicesEnum.Hidden;
    this.opponentChoiceState = RPSChoicesEnum.Hidden;
  
    this.choice = undefined;
    this.opponentChoice = '';
  
    this.winner = false;
    this.looser = false;
    this.draw = false;
  
    this.timerTime = -1; 

    this.roundActive = true;
  }

  updateScore(playerScore: number, opponentScore: number): void {
    this.score = playerScore;
    this.opponentScore = opponentScore;
  }

  showGameOverPopup(): void {
    this.isGameOver = true;
  }

  onChoiceClick(choice: RPSChoicesEnum): void {
    if (!this.roundActive) return;
    this.changeChoice(choice);
  }

  leaveGame(): void {
    this.rpsService.disconnect();
    this.router.navigate(['/dashboard']);
  }

  setData(data: Partial<Pick<this, 'choice' | 'opponentChoice' | 'score' | 'opponentScore' | 'timerTime' | 'winner' | 'looser' | 'round' | 'draw'>>): void {
    Object.assign(this, data);
    if (data.opponentChoice !== undefined) {
      this.opponentChoiceState = RPSChoicesEnum.Visible;
    }
    if (data.timerTime !== undefined) {
      this.updateTimer(data.timerTime);
    }
  }
}
