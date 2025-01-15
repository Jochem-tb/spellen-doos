import { Socket } from 'socket.io';

export interface IBingoGameServer {
  calledNumbers: number[];
  availableNumbers: number[];

  maximumNumber: number;

  connectedPlayers: Socket[];
}

export enum BingoResultEnum {
  VALID = 'valid',
  NOT_VALID = 'notValid',
  UNKNOWN = 'Unknown',
}

export enum BingoGameEvents {
  I_HAVE_BINGO = 'iHaveBingo',
  BINGO_CALLED = 'bingoCalled',
  BINGO_RESULT = 'bingoResult',
}

export interface IBingoCard {
  card: number[][];
  hasBingo: boolean;
}

export abstract class BingoCard implements IBingoCard {
  generateCard(): number[][] {
    return Array.from({ length: 5 }, () => this.generateRow());
  }
  generateRow(): number[] {
    const row = Array.from({ length: 5 }, () => this.generateNumber());
    return row;
  }
  generateNumber(): number {
    return Math.floor(Math.random() * 15) + 1;
  }
  card: number[][] = this.generateCard();
  hasBingo: boolean = false;
}
