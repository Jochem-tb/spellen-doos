import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { Router } from '@angular/router';
import { GameServerService } from './gameServer.service';
// import { RPSGameServerController } from './gameServer.service';

@Component({
  selector: 'lib-waitScreen',
  standalone: false,
  templateUrl: './waitScreen.component.html',
  styleUrls: ['./waitScreen.component.css'],
})
export class WaitScreenComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  //GameFound message
  public displayGameFound: boolean = false;
  public gameFoundMessage: string = 'Tegenstander(s) gevonden!';
  public gameFoundTimer: number = -1;

  //Game Information
  public gameTitle: string = '';
  public displayTime: string = '00:00';

  //Number of players in queue
  public numPlayersInQueue: number = -1;
  private numPlayerQueueCheckInterval: number = 4;
  private numPlayerQueueCounter: number = 0;

  //Wait Timer
  private elapsedSeconds: number = 0;
  private timerSubscription?: Subscription;

  //Tip information
  private tipsCounter: number = 0;

  //Change tip every 10 seconds
  private randomTipIndexChangeInterval: number = 10;

  //List of tips
  public tips: string[] = [
    'Tip 1: Wist u dat er een help knop is rechtonderin het scherm? Hier kunt u altijd terecht voor hulp!',
    'Tip 2: Houdt het altijd gezellig, het zijn maar spelletjes!',
    'Tip 3: Wist u dat u uw eigen profiel foto kunt instellen? Ga naar uw profiel om dit te doen!',
    'Tip 4: Wist u dat u na een spelletje, hetzelfde spel opnieuw kunt starten?',
    'Tip 5: Wist u dat u uw gegevens kunt aanpassen? Ga naar uw profiel om dit te doen!',
  ];

  //Index of the current tip
  public randomTipIndex: number = 0;

  constructor(
    private gameServerService: GameServerService,
    private router: Router
  ) {
    gameServerService.waitScreenComponent = this;
  }

  ngOnInit(): void {
    //Set the title of the wait screen
    //TODO: Implement real call with ID in Route
    this.gameTitle = 'Steen Papier Schaar';

    //Start the timer
    this.startTimer();

    // Wait for 5 seconds before proceeding
    const success = this.gameServerService.signIntoQueue(this.gameTitle);
    if (success) {
      console.log('signIntoQueue succesfull');
    } else {
      console.error('signIntoQueue failed');
      this.router.navigate(['/dashboard']);
    }

    this.gameServerService
      .getNumberOfPlayersInQueue()
      .subscribe((numPlayers) => (this.numPlayersInQueue = numPlayers));
  }

  ngOnDestroy(): void {
    // Stop the timer
    this.stopTimer();

    this.gameServerService.signOutOfQueue();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      //Update the time
      this.elapsedSeconds++;
      this.displayTime = this.formatTime(this.elapsedSeconds);

      //Check for tip change
      this.tipsCounter++;
      this.checkIntervalForTipChange();

      //Check for number of players in queue
      this.numPlayerQueueCounter++;
      this.checkIntervalForNumPlayerQueueChange();
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private getRandomTipIndex(): number {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.tips.length);
    } while (newIndex === this.randomTipIndex);
    return newIndex;
  }

  private changeRandomTipIndex(): void {
    this.randomTipIndex = this.getRandomTipIndex();
  }

  private checkIntervalForTipChange(): void {
    if (this.tipsCounter >= this.randomTipIndexChangeInterval) {
      this.changeRandomTipIndex();
      this.tipsCounter = 0;
    }
  }

  private checkIntervalForNumPlayerQueueChange(): void {
    if (this.numPlayerQueueCounter >= this.numPlayerQueueCheckInterval) {
      this.gameServerService
        .getNumberOfPlayersInQueue()
        .subscribe((numPlayers) => {
          this.numPlayersInQueue = numPlayers;
        });
      this.numPlayerQueueCounter = 0;
    }
  }
}
