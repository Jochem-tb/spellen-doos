import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RPSService } from './rps.service';
import { RPSChoicesEnum, VisibilityEnum } from '@spellen-doos/shared/api';
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
      state(VisibilityEnum.Hidden, style({ transform: 'translateX(-100%)', opacity: 0 })),
      state(VisibilityEnum.Visible, style({ transform: 'translateX(0)', opacity: 1 })),
  
      transition(`${VisibilityEnum.Hidden} => ${VisibilityEnum.Visible}`, [animate('0.5s ease-in-out')]),
      transition(`${VisibilityEnum.Visible} => ${VisibilityEnum.Hidden}`, [animate('0.5s ease-in-out')]),
    ]),
    trigger('slideInOpponent', [
      state(VisibilityEnum.Hidden, style({ transform: 'translateX(100%)', opacity: 0 })),
      state(VisibilityEnum.Visible, style({ transform: 'translateX(0)', opacity: 1 })),
  
      transition(`${VisibilityEnum.Hidden} => ${VisibilityEnum.Visible}`, [animate('0.5s ease-in-out')]),
      transition(`${VisibilityEnum.Visible} => ${VisibilityEnum.Hidden}`, [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class RpsComponent implements OnDestroy {
  RPSChoicesEnum = RPSChoicesEnum;
  VisibilityEnum = VisibilityEnum;

  roundActive = true

  choice?: RPSChoicesEnum;
  opponentChoice: string = '';
  score: number = 0;
  opponentScore: number = 0;

  timerTime: number = -1;

  winner: boolean = false;
  loser: boolean = false;
  draw: boolean = false;
  round: number = 0;

  userChoiceState: VisibilityEnum.Hidden | VisibilityEnum.Visible = VisibilityEnum.Hidden;
  opponentChoiceState: VisibilityEnum.Hidden | VisibilityEnum.Visible = VisibilityEnum.Hidden;

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
      this.userChoiceState = VisibilityEnum.Hidden;
      return;
    }
  
    if (this.choice && this.choice !== newChoice) {
      this.userChoiceState = VisibilityEnum.Hidden;
  
      setTimeout(() => {
        this.choice = newChoice;
        this.userChoiceState = VisibilityEnum.Visible;
        this.rpsService.changeChoice(newChoice);
      }, 500);
      return;
    }
  
    this.choice = newChoice;
    this.userChoiceState = VisibilityEnum.Visible;
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
    this.userChoiceState = VisibilityEnum.Hidden;
    this.opponentChoiceState = VisibilityEnum.Hidden;
  
    this.choice = undefined;
    this.opponentChoice = '';
  
    this.winner = false;
    this.loser = false;
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

  setData(data: Partial<Pick<this, 'choice' | 'opponentChoice' | 'score' | 'opponentScore' | 'timerTime' | 'winner' | 'loser' | 'round' | 'draw'>>): void {
    Object.assign(this, data);
    if (data.opponentChoice !== undefined) {
      this.opponentChoiceState = VisibilityEnum.Visible;
    }
    if (data.timerTime !== undefined) {
      this.updateTimer(data.timerTime);
    }
  }
}
