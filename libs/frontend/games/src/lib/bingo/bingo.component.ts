import { Component } from '@angular/core';
import { BingoService } from './bingo.service';
import {
  BingoCard,
  IBingoCard,
  RPSChoicesEnum,
} from '@spellen-doos/shared/api';

@Component({
  selector: 'lib-bingo',
  standalone: false,
  templateUrl: './bingo.component.html',
  styleUrls: ['./bingo.component.css'],
})
export class BingoComponent {
  playerCard!: BingoCard;
  hasBingo: boolean = false;

  constructor(private bingoService: BingoService) {
    // Koppel deze component aan de service (zodat de service kan updaten).
    console.log('[DEBUG] Bingo Component constructor...');
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

  updateBingoCard(card: BingoCard): void {
    this.playerCard = card;
  }
}
