import { Inject, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  BaseGatewayEvents,
  IGame,
  IGameGateway,
  RPSChoicesEnum,
  RPSGameEvents,
} from '@spellen-doos/shared/api';
import { interval } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { RPSGameServerController } from './rpsGameServer.controller';

@Injectable()
@WebSocketGateway({
  namespace: '/RPSGameServerControllerGateway', // Optional namespace
  cors: {
    origin: '*', // Replace with your client URL in production
  },
})
export class RPSGameServerControllerGateway
  implements IGameGateway, OnGatewayConnection, OnGatewayDisconnect
{
  private games: Map<string, RPSGameServerController> = new Map();
  queue: string[] = [];
  minPlayerForGame: number = 2;
  maxPlayerForGame: number = 2;
  recommendedPlayerForGame: number = 2;
  game?: IGame | undefined;
  connectedPlayers: string[] = [];

  @WebSocketServer()
  server!: Server;

  // Handle new client connections
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(
      `Client connected to RPSGameServerControllerGateway clientId: ${client.id}`
    );
    this.queue.push(client.id);
    interval(1000).subscribe(() => {
      if (this.checkRequirementsForGame()) {
        console.log('Requirements met for game');
        const playersForGame = this.queue.splice(0, this.maxPlayerForGame);
        console.log('Starting game with players:', playersForGame);

        console.log('Creating new rpsServer');
        const gameId = this.createGame(playersForGame);

        console.log('Emitting start game event');
        this.server
          .to(playersForGame)
          .emit(BaseGatewayEvents.START_GAME, gameId);
      }
    });
  }

  private createGame(players: string[]): string {
    const gameId = `game-${Date.now()}`;
    console.log(`Game created with ID: ${gameId} for players: ${players}`);

    const newGame = new RPSGameServerController(gameId, players);
    this.games.set(gameId, newGame);

    console.log('Games:', this.games);
    return gameId;
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    this.queue = this.queue.filter((id) => id !== client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE)
  getPlayerQueue(@MessageBody() clientId: string): void {
    console.log('Returning number of players in queue');
    console.log('Queue length:', this.queue.length);
    console.log('Client ID:', clientId);
    this.broadCastToSingleClient(
      clientId,
      BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE,
      this.queue.length
    );
  }

  // @SubscribeMessage(RPSGameEvents.CHANGE_CHOICE)
  // changeChoice(
  //   @MessageBody() data: { choice: RPSChoicesEnum; clientId: string }
  // ): void {
  //   const { choice, clientId } = data;
  //   console.log('Change choice event received');
  //   console.log('Choice:', choice);
  //   console.log('Client ID:', clientId);
  // }

  private checkRequirementsForGame(): boolean {
    return this.queue.length >= this.minPlayerForGame;
  }

  broadCastToSingleClient(clientId: string, event: string, payload: any) {
    this.server.to(clientId).emit(event, payload);
  }
}
