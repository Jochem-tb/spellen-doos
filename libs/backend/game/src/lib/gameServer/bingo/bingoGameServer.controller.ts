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

  someoneCalledBingo(clientId: string, bingoCard: BingoCard): void {
    if (!this.connectedPlayers.some((player) => player.id === clientId)) {
      console.error(
        `[ERROR] Invalid clientId: ${clientId} for game: ${this.gameId}`
      );
      return;
    }

    console.log(`Player ${clientId} called bingo!`);
    console.log('[DEBUG] Bingo card:', bingoCard);

    // Broadcast to all players in the room
    this.gateway.broadcastToRoom(this.gameId, BingoGameEvents.BINGO_CALLED, {
      clientId,
    });

    // Evaluate the bingo card
    const validBingo: BingoResultEnum = this.evaluateBingo(bingoCard);
    console.log(`[DEBUG] Bingo card evaluation result: ${validBingo}`);

    // Broadcast the result to all players in the room
    this.gateway.broadcastToRoom(this.gameId, BingoGameEvents.BINGO_RESULT, {
      clientId,
      result: validBingo,
    });
  }

  private evaluateBingo(bingoCard: BingoCard): BingoResultEnum {
    return BingoResultEnum.UNKNOWN;
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
}
