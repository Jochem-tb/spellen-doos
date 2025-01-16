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
  BINGO_CARD = 'bingoCard',
  NUMBER_CALLED = 'numberCalled',
}

export interface IBingoCard {
  usedNumbers: number[];
  card: number[][];
  hasBingo: boolean;
}

export class BingoCard implements IBingoCard {
  usedNumbers: number[] = [];
  card: number[][] = this.generateCard();
  hasBingo: boolean = false;

  generateCard(): number[][] {
    return Array.from({ length: 5 }, () => this.generateRow());
  }

  generateRow(): number[] {
    const row = Array.from({ length: 5 }, () => this.generateNumber());
    return row;
  }

  generateNumber(): number {
    let number: number;
    let maxTry: number = 0;
    do {
      number = Math.floor(Math.random() * 99) + 1;
      maxTry++;
    } while (this.usedNumbers.includes(number) || maxTry > 100);
    this.usedNumbers.push(number);
    return number;
  }
}
