import { Component } from '@angular/core';
import { BingoService } from './bingo.service';
import {
  BingoCard,
  IBingoCard,
  RPSChoicesEnum,
} from '@spellen-doos/shared/api';
import { interval } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'lib-bingo',
  standalone: false,
  templateUrl: './bingo.component.html',
  styleUrls: ['./bingo.component.css'],
  providers: [BingoService],
  animations: [
    trigger('rollAnimation', [
      transition(':enter', [
        style({
          transform: 'translateX(-100vw) rotate(-360deg)',
          opacity: 0,
        }),
        animate(
          '1.5s ease-out',
          style({
            transform: 'translateX(0) rotate(0deg)',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '1.5s ease-in',
          style({
            transform: 'translateX(100vw) rotate(360deg) ',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class BingoComponent {
  bingoService: BingoService;
  playerCard!: BingoCard;
  selectedCells: Set<Number> = new Set();
  hasBingo: boolean = false;

  successBingo: boolean = true;
  currentCalledNumber = -1;

  startMessage: string | undefined = undefined;

  constructor(bingoService: BingoService) {
    // Koppel deze component aan de service (zodat de service kan updaten).
    console.log('[DEBUG] Bingo Component constructor...');
    this.bingoService = bingoService;
    this.bingoService.component = this;
    // console.log('[DEBUG] Generating player card...');
    // this.playerCard = new BingoCard();
    console.log('[DEBUG] Player card:', this.playerCard);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  disconnect(): void {
    console.log('[DEBUG] Disconnecting...');
    this.bingoService.disconnect();
  }

  iHaveBingo(): void {
    this.bingoService.callBingo(this.playerCard);
  }
  updateBingoCard(card: BingoCard): void {
    this.playerCard = card;
  }

  updateCalledNumber(number: number): void {
    console.log('[DEBUG] Updating called number:', number);
    this.currentCalledNumber = -1; // Reset to trigger animation
    setTimeout(() => {
      this.currentCalledNumber = number;
    }, 10); // Short delay to ensure animation re-triggers
  }

  toggleCell(cellValue: number): void {
    if (this.selectedCells.has(cellValue)) {
      this.selectedCells.delete(cellValue); // Deselect
    } else {
      this.selectedCells.add(cellValue); // Select
    }
  }

  isCellSelected(cellValue: number): boolean {
    return this.selectedCells.has(cellValue);
  }

  requestBingoCard(): void {
    this.bingoService.getBingoCard();
  }

  startNumberCalling(): void {
    console.log('[DEBUG] Starting number calling...');
    this.displayStartMessage(true);
    setTimeout(() => {
      this.displayStartMessage(false);
    }, 5000);
  }

  displayStartMessage(bool: boolean): void {
    console.log('[DEBUG] Displaying start message:', bool);
    if (bool) {
      this.startMessage = 'Ben je er klaar voor? \n We gaan nu beginnen!';
    } else {
      this.startMessage = undefined;
    }
  }
}
