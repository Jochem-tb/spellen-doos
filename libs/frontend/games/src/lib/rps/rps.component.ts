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
      state(
        VisibilityEnum.Hidden,
        style({ transform: 'translateX(-100%)', opacity: 0 })
      ),
      state(
        VisibilityEnum.Visible,
        style({ transform: 'translateX(0)', opacity: 1 })
      ),
      transition(
        `${VisibilityEnum.Hidden} => ${VisibilityEnum.Visible}`,
        [animate('0.5s ease-in-out')]
      ),
      transition(
        `${VisibilityEnum.Visible} => ${VisibilityEnum.Hidden}`,
        [animate('0.5s ease-in-out')]
      ),
    ]),
    trigger('slideInOpponent', [
      state(
        VisibilityEnum.Hidden,
        style({ transform: 'translateX(100%)', opacity: 0 })
      ),
      state(
        VisibilityEnum.Visible,
        style({ transform: 'translateX(0)', opacity: 1 })
      ),
      transition(
        `${VisibilityEnum.Hidden} => ${VisibilityEnum.Visible}`,
        [animate('0.5s ease-in-out')]
      ),
      transition(
        `${VisibilityEnum.Visible} => ${VisibilityEnum.Hidden}`,
        [animate('0.5s ease-in-out')]
      ),
    ]),
  ],
})
export class RpsComponent implements OnDestroy {
  RPSChoicesEnum = RPSChoicesEnum;
  VisibilityEnum = VisibilityEnum;
  roundActive = true;
  choice?: RPSChoicesEnum;
  opponentChoice = '';
  score = 0;
  opponentScore = 0;
  timerTime = -1;
  winner = false;
  loser = false;
  draw = false;
  round = 0;
  userChoiceState = VisibilityEnum.Hidden;
  opponentChoiceState = VisibilityEnum.Hidden;
  isGameOver = false;
  private intervalId?: number;

  constructor(private rpsService: RPSService, private router: Router) {
    this.rpsService.component = this;
  }

  ngOnDestroy(): void {
    this.rpsService.disconnect();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onChoiceClick(choice: RPSChoicesEnum): void {
    if (!this.roundActive) return;
    this.changeChoice(choice);
  }

  changeChoice(newChoice: RPSChoicesEnum): void {
    if (this.choice === newChoice) {
      this.userChoiceState = VisibilityEnum.Hidden; // Start fade-out effect
      setTimeout(() => {
        this.choice = undefined; // Clear the choice after the fade-out
        this.rpsService.changeChoice(newChoice); // Notify the service about the cleared choice
        console.log('Choice cleared');
      }, 500); 
      return;
    }
  
    if (this.choice != null) {
      this.userChoiceState = VisibilityEnum.Hidden; // Fade out the current choice
      setTimeout(() => {
        this.choice = newChoice; // Set the new choice
        this.userChoiceState = VisibilityEnum.Visible; // Make the new choice visible
        this.rpsService.changeChoice(newChoice); // Notify the service about the new choice
      }, 500); 
      return;
    }
  
    this.choice = newChoice;
    this.userChoiceState = VisibilityEnum.Visible; // Show the new choice immediately
    this.rpsService.changeChoice(newChoice);
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

  leaveGame(): void {
    this.rpsService.disconnect();
    this.router.navigate(['/dashboard']);
  }

  getImageUrl(choice: string): string {
    return `rps/${choice.toLowerCase()}.png`;
  }

  setData(
    data: Partial<Pick<this, 'choice' | 'opponentChoice' | 'score' | 'opponentScore' | 'timerTime' | 'winner' | 'loser' | 'round' | 'draw'>>
  ): void {
    Object.assign(this, data);
    if (data.opponentChoice !== undefined) {
      this.opponentChoiceState = VisibilityEnum.Visible;
    }
    if (data.timerTime !== undefined) {
      this.updateTimer(data.timerTime);
    }
  }
}
