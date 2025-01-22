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
  START_NUMBER_CALLING = 'startNumberCalling',
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
    return [
      this.generateColumn(1, 20),
      this.generateColumn(21, 40),
      this.generateColumn(41, 60),
      this.generateColumn(61, 80),
      this.generateColumn(81, 99),
    ].map((_, i, columns) => columns.map((column) => column[i]));
  }

  generateColumn(min: number, max: number): number[] {
    const column = Array.from({ length: 5 }, () =>
      this.generateNumber(min, max)
    );
    return column;
  }

  generateNumber(min: number, max: number): number {
    let number: number;
    let maxTry: number = 0;
    do {
      number = Math.floor(Math.random() * (max - min + 1)) + min;
      maxTry++;
    } while (this.usedNumbers.includes(number) || maxTry > 100);
    this.usedNumbers.push(number);
    return number;
  }
}
