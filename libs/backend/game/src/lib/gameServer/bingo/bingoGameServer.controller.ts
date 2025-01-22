import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { GameRPSServerDocument } from './gameServer.schema';
import {
  BaseGatewayEvents,
  BingoCard,
  BingoGameEvents,
  BingoResultEnum,
  IBingoGameServer,
  IGame,
  IRPSGameServer,
  IRPSRoundInfo,
  RPSChoicesEnum,
  RPSGameEvents,
  RPSWinnerEnum,
} from '@spellen-doos/shared/api';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { BingoGameServerControllerGateway } from './bingoGameServer.gateway';
import { interval } from 'rxjs';

export class BingoGameServerController implements IBingoGameServer {
  bingoCards: Map<Socket, BingoCard>;
  maximumNumber: number = 99;
  calledNumbers: number[] = [];
  availableNumbers: number[] = Array.from(
    { length: this.maximumNumber },
    (_, i) => i + 1
  );
  connectedPlayers!: Socket[];
  private playerReadiness: Map<Socket, boolean> = new Map();

  timerActive: boolean = false;
  private activeInterval: NodeJS.Timeout | null = null; // Track the active interval

  gateway!: BingoGameServerControllerGateway;
  alreadyCheckingBingo: boolean = false;

  constructor(
    private readonly gameId: string,
    players: Socket[],
    gateway: BingoGameServerControllerGateway
  ) {
    this.connectedPlayers = players;
    this.gateway = gateway;
    console.log(
      `%cBingo game controller created for room: ${gameId}`,
      'color: blue;'
    );
    console.log(
      '%c[DEBUG] Connected players:',
      'color: green;',
      this.connectedPlayers.length
    );
    console.log(
      '%c[DEBUG] Available numbers:',
      'color: orange;',
      this.availableNumbers
    );
    console.log('%c[DEBUG] Generating bingo cards...', 'color: purple;');
    this.bingoCards = this.generateBingoCards(players);
    console.log('%c[DEBUG] Bingo cards:', 'color: red;', this.bingoCards.size);

    // Initialize the readiness map for all connected players
    console.log('[DEBUG] Initializing player readiness to false...');
    players.forEach((playerSocket) => {
      this.playerReadiness.set(playerSocket, false); // Set all players as "not ready"
    });
  }

  stopGame(): void {
    this.stopNumberCalling();
  }

  playerReady(playerSocket: Socket): void {
    this.playerReadiness.set(playerSocket, true);
    console.log(`[BINGO] Player ${playerSocket.id} is now ready.`);

    if (this.allPlayersReady()) {
      this.startNumberCalling(10000); // All players are ready, start number calling
    }
  }

  // Method to check if all players are ready
  allPlayersReady(): boolean {
    // Check if every player is marked as ready
    return this.connectedPlayers.every(
      (playerSocket) => this.playerReadiness.get(playerSocket) === true
    );
  }

  startNumberCalling(intervalMs: number = 10000): void {
    if (this.timerActive) {
      console.warn('[BINGO] Number calling is already active.');
      return;
    }

    console.log('[BINGO] Starting number calling...');
    this.gateway.broadcastToRoom(
      this.gameId,
      BingoGameEvents.START_NUMBER_CALLING,
      {}
    );

    this.timerActive = true;
    this.activeInterval = setInterval(() => {
      if (this.availableNumbers.length === 0) {
        console.log('[BINGO] No more numbers to call!');
        this.stopNumberCalling();
        return;
      }

      if (this.connectedPlayers.length === 0) {
        console.log('[BINGO] No more players connected!');
        this.stopGame();
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * this.availableNumbers.length
      );
      const calledNumber = this.availableNumbers.splice(randomIndex, 1)[0]; // Remove from availableNumbers
      this.calledNumbers.push(calledNumber); // Add to calledNumbers

      console.log(`[BINGO - ${this.gameId}] Called Number: ${calledNumber}`);

      // Broadcast the new number to all players
      this.gateway.broadcastToRoom(this.gameId, BingoGameEvents.NUMBER_CALLED, {
        number: calledNumber,
        remaining: this.availableNumbers.length,
      });
    }, intervalMs);
  }

  stopNumberCalling(): void {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
      this.timerActive = false;
      console.log('[BINGO] Number calling stopped.');
    }
  }

  getBingoCard(clientSocket: Socket): BingoCard | undefined {
    return this.bingoCards.get(clientSocket);
  }

  someoneCalledBingo(playerSocket: Socket, bingoCard: BingoCard): void {
    if (this.alreadyCheckingBingo) {
      console.warn(
        `[BINGO] Bingo call already in progress for game: ${this.gameId}`
      );
      return;
    }

    this.alreadyCheckingBingo = true;

    console.log(
      `someoneCalledBingo called for player: ${playerSocket.id} in game: ${this.gameId} with card: ${bingoCard}`
    );
    if (
      !this.connectedPlayers.some((player) => player.id === playerSocket.id)
    ) {
      console.error(
        `[ERROR] Invalid clientId: ${playerSocket.id} for game: ${this.gameId}`
      );
      this.alreadyCheckingBingo = false;
      return;
    }

    console.log(`Player ${playerSocket.id} called bingo!`);

    const bingoCardById = this.bingoCards.get(playerSocket);
    if (
      bingoCardById === undefined ||
      !this.compareBingoCards(bingoCardById, bingoCard)
    ) {
      console.error(
        `[ERROR] Bingo card mismatch for player: ${playerSocket.id}`
      );
      this.alreadyCheckingBingo = false;
      return;
    }

    // Broadcast to all players in the room
    this.gateway.broadcastToRoom(this.gameId, BingoGameEvents.BINGO_CALLED, {
      clientId: playerSocket.id,
    });

    // Evaluate the bingo card
    const validBingo: BingoResultEnum = this.evaluateBingo(bingoCard);
    console.log(`[DEBUG] Bingo card evaluation result: ${validBingo}`);

    // Broadcast the result to all players in the room
    this.gateway.broadcastToRoom(this.gameId, BingoGameEvents.BINGO_RESULT, {
      clientId: playerSocket.id,
      result: validBingo,
    });

    if (validBingo === BingoResultEnum.VALID) {
      this.stopGame();
      interval(13000).subscribe(() => {
        this.gateway.broadcastToRoom(this.gameId, BaseGatewayEvents.GAME_OVER, {
          reason: 'Iemand heeft een goede bingo!',
        });
      });
    } else {
      this.alreadyCheckingBingo = false;
    }
  }

  private evaluateBingo(bingoCard: BingoCard): BingoResultEnum {
    const card = bingoCard.card; // 2D array representing the bingo card
    const gridSize = card.length; // Assuming a square grid (5x5)

    console.log('[DEBUG] Evaluating bingo card:', card);

    let result: BingoResultEnum = BingoResultEnum.NOT_VALID;

    if (this.checkHorizontalBingo(card)) {
      console.log('[BINGO] Horizontal bingo detected!');
      result = BingoResultEnum.VALID;
    } else if (this.checkVerticalBingo(card, gridSize)) {
      console.log('[BINGO] Vertical bingo detected!');
      result = BingoResultEnum.VALID;
    } else if (this.checkDiagonalBingo(card, gridSize)) {
      console.log('[BINGO] Diagonal bingo detected!');
      result = BingoResultEnum.VALID;
    }

    console.log(`[DEBUG] Bingo card evaluation result: ${result}`);
    return result;
  }

  private checkHorizontalBingo(card: number[][]): boolean {
    for (let row of card) {
      if (row.every((num) => this.calledNumbers.includes(num))) {
        return true;
      }
    }
    return false;
  }

  private checkVerticalBingo(card: number[][], gridSize: number): boolean {
    for (let col = 0; col < gridSize; col++) {
      let columnNumbers = card.map((row) => row[col]);
      if (columnNumbers.every((num) => this.calledNumbers.includes(num))) {
        return true;
      }
    }
    return false;
  }

  private checkDiagonalBingo(card: number[][], gridSize: number): boolean {
    let leftToRight = card.every((row, i) =>
      this.calledNumbers.includes(row[i])
    );

    let rightToLeft = card.every((row, i) =>
      this.calledNumbers.includes(row[gridSize - 1 - i])
    );

    return leftToRight || rightToLeft;
  }

  private checkHorizontalBingo(card: number[][]): boolean {
    for (let row of card) {
      if (row.every((num) => this.calledNumbers.includes(num))) {
        return true;
      }
    }
    return false;
  }

  private checkVerticalBingo(card: number[][], gridSize: number): boolean {
    for (let col = 0; col < gridSize; col++) {
      let columnNumbers = card.map((row) => row[col]);
      if (columnNumbers.every((num) => this.calledNumbers.includes(num))) {
        return true;
      }
    }
    return false;
  }

  private checkDiagonalBingo(card: number[][], gridSize: number): boolean {
    let leftToRight = card.every((row, i) =>
      this.calledNumbers.includes(row[i])
    );

    let rightToLeft = card.every((row, i) =>
      this.calledNumbers.includes(row[gridSize - 1 - i])
    );

    return leftToRight || rightToLeft;
  }

  private generateBingoCards(players: Socket[]): Map<Socket, BingoCard> {
    // Generate bingo cards for all players
    const bingoCards: Map<Socket, BingoCard> = new Map();
    players.forEach((playerSocket) => {
      const card = new BingoCard();
      bingoCards.set(playerSocket, card);
    });
    return bingoCards;
  }

  private compareBingoCards(
    bingoCard1: BingoCard,
    bingoCard2: BingoCard
  ): boolean {
    console.log('[DEBUG] Comparing bingo cards...');
    const card1 = bingoCard1.card;
    const card2 = bingoCard2.card;
    if (card1.length !== card2.length) return false;
    for (let i = 0; i < card1.length; i++) {
      if (card1[i].length !== card2[i].length) return false;
      for (let j = 0; j < card1[i].length; j++) {
        if (card1[i][j] !== card2[i][j]) return false;
      }
    }
    return true;
  }
}
