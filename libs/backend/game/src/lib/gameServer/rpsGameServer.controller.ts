import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { GameRPSServerDocument } from './gameServer.schema';
import {
  BaseGatewayEvents,
  IGame,
  IRPSGameServer,
  IRPSRoundInfo,
  RPSChoicesEnum,
  RPSGameEvents,
} from '@spellen-doos/shared/api';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RPSGameServerController
  implements IRPSGameServer, OnGatewayConnection, OnGatewayDisconnect
{
  maxRounds: number = 0;
  currentRound: number = 0;

  playerAWins: number = 0;
  playerBWins: number = 0;
  draws: number = 0;

  playerAChoice?: RPSChoicesEnum;
  playerBChoice?: RPSChoicesEnum;

  playerAClientId?: string;
  playerBClientId?: string;
  roundsInfo: IRPSRoundInfo[] = [];

  @WebSocketServer()
  server!: Server;

  constructor(private gameId: string, players: string[]) {
    [this.playerAClientId, this.playerBClientId] = players;

    // Create a unique namespace for this game
    const namespaceName = `/${gameId}`;
    this.server = new Server({ cors: { origin: '*' } });
    console.log(`Created new game server with namespace: ${namespaceName}`);
    this.server.of(namespaceName).on(BaseGatewayEvents.CONNECT, (socket) => {
      console.log(`Player connected to game ${gameId}: ${socket.id}`);

      socket.on(BaseGatewayEvents.DISCONNECT, () => {
        console.log(`Player disconnected from game ${gameId}: ${socket.id}`);
        // Handle game end or disconnection
      });
    });
  }

  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  handleConnection(client: Socket, ...args: any[]): void {
    const gameId = client.handshake.query['gameId']; // Extract the gameId from the query parameters
    console.log(`Client connected to game ${gameId}: ${client.id}`);

    // Dynamically attach the socket to the namespace
    const gameNamespace = this.server.of(`/${gameId}`);
    gameNamespace.on(BaseGatewayEvents.CONNECT, (socket) => {
      console.log(`Player connected to game ${gameId}: ${socket.id}`);

      socket.on(BaseGatewayEvents.DISCONNECT, () => {
        console.log(`Player disconnected from game ${gameId}: ${socket.id}`);
        // Handle game end or disconnection
      });
    });
  }

  @SubscribeMessage(RPSGameEvents.CHANGE_CHOICE)
  changeChoice(
    @MessageBody() data: { choice: RPSChoicesEnum; clientId: string }
  ): void {
    const { choice, clientId } = data;
    console.log('Change choice event received');
    console.log('Choice:', choice);
    console.log('Client ID:', clientId);
    if (this.playerAClientId === clientId) {
      this.playerAChoice = choice;
    } else if (this.playerBClientId === clientId) {
      this.playerBChoice = choice;
    }
  }
}
