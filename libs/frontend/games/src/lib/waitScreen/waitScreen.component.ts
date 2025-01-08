import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Time } from '@angular/common';
import { WaitScreenService } from './waitScreen.service';
import { interval, Subscription } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

@Component({
  selector: 'lib-waitScreen',
  standalone: false,
  templateUrl: './waitScreen.component.html',
  styleUrls: ['./waitScreen.component.css'],
})
export class WaitScreenComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public numPlayersInQueue: number = -1;
  public gameTitle: string = '';
  public displayTime: string = '00:00';

  private elapsedSeconds: number = 0;
  private timerSubscription?: Subscription;

  constructor(private waitScreenService: WaitScreenService) {}

  ngOnInit(): void {
    //Set the title of the wait screen
    //TODO: Implement real call with ID in Route
    this.gameTitle = 'PlaceHolderGameTitle';

    //Start the timer
    this.startTimer();

    const subscriptionIntoQueue = this.waitScreenService
      .signIntoQueue()
      .subscribe({
        next: (success: boolean) => {
          if (success) {
            this.waitScreenService
              .getNumberOfPlayersInQueue()
              .subscribe((numPlayers) => (this.numPlayersInQueue = numPlayers));
            console.log('signIntoQueue completed');
          } else {
            console.error('signIntoQueue failed');
          }
        },
        error: (err: any) => console.error('signIntoQueue failed', err),
      });
    this.subscriptions.push(subscriptionIntoQueue);
  }

  ngOnDestroy(): void {
    // Stop the timer
    this.stopTimer();

    this.waitScreenService
      .signOutOfQueue()
      .subscribe((next) => console.log('signOutOfQueue completed'));
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedSeconds++;
      this.displayTime = this.formatTime(this.elapsedSeconds);
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
}
