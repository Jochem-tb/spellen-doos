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

export class BingoGameServerController implements IBingoGameServer {
  bingoCards: Map<Socket, BingoCard>;
  maximumNumber: number = 99;
  calledNumbers: number[] = [];
  availableNumbers: number[] = Array.from(
    { length: this.maximumNumber },
    (_, i) => i + 1
  );
  connectedPlayers!: Socket[];

  timerActive: boolean = false;
  private activeInterval: NodeJS.Timeout | null = null; // Track the active interval

  gateway!: BingoGameServerControllerGateway;

  constructor(
    private readonly gameId: string,
    players: Socket[],
    gateway: BingoGameServerControllerGateway
  ) {
    this.connectedPlayers = players;
    this.gateway = gateway;
    console.log(`Bingo game controller created for room: ${gameId}`);
    console.log('[DEBUG] Connected players:', this.connectedPlayers.length);
    console.log('[DEBUG] Available numbers:', this.availableNumbers);
    console.log('[DEBUG] Generateing bingo cards...');
    this.bingoCards = this.generateBingoCards(players);
    console.log('[DEBUG] Bingo cards:', this.bingoCards.size);
  }

  getBingoCard(clientSocket: Socket): BingoCard | undefined {
    return this.bingoCards.get(clientSocket);
  }

  someoneCalledBingo(playerSocket: Socket, bingoCard: BingoCard): void {
    console.log(
      `someoneCalledBingo called for player: ${playerSocket.id} in game: ${this.gameId} with card: ${bingoCard}`
    );
    if (
      !this.connectedPlayers.some((player) => player.id === playerSocket.id)
    ) {
      console.error(
        `[ERROR] Invalid clientId: ${playerSocket.id} for game: ${this.gameId}`
      );
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
  }

  private evaluateBingo(bingoCard: BingoCard): BingoResultEnum {
    return BingoResultEnum.NOT_VALID;
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
