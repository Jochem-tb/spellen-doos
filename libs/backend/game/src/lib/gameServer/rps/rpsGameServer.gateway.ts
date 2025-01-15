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
import { interval, NotFoundError } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { RPSGameServerController } from './rpsGameServer.controller';
import { MIN } from 'class-validator';

@Injectable()
@WebSocketGateway({
  namespace: '/RPSGameServerControllerGateway', // Optional namespace
  cors: {
    origin: '*', // Replace with your client URL in production
  },
})
export class RPSGameServerControllerGateway
  implements
    IGameGateway<RPSGameServerController>,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  games: Map<string, RPSGameServerController> = new Map();
  rooms: Map<string, Socket[]> = new Map();

  queue: Socket[] = [];
  minPlayerForGame: number = 2;
  maxPlayerForGame: number = 2;
  recommendedPlayerForGame: number = 2;

  private readonly TIME_FOR_RECONNECTION_IN_MS = 30000; // 30 seconds

  @WebSocketServer()
  server!: Server;

  // Handle ALL incoming Connectioning clients
  handleConnection(@ConnectedSocket() client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    this.queue.push(client);

    if (this.checkRequirementsForGame()) {
      console.log('Requirements met for game');
      this.createGameRoom();
    }
  }

  private checkRequirementsForGame(): boolean {
    return this.queue.length >= this.minPlayerForGame;
  }

  private createGameRoom(): void {
    const players = this.queue.splice(0, this.minPlayerForGame);
    const roomId = `room-${Date.now()}`;
    console.debug('Creating room:', roomId);
    this.rooms.set(roomId, players);

    const gameController = new RPSGameServerController(roomId, players, this);
    this.games.set(roomId, gameController);

    players.forEach((player) => {
      player.join(roomId);
      player.emit(BaseGatewayEvents.SETUP_GAME, roomId);
    });
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    // Remove player from queue if present
    this.queue = this.queue.filter((socket) => socket.id !== client.id);

    // Remove player from rooms if present
    this.rooms.forEach((players, roomId) => {
      this.rooms.set(
        roomId,
        players.filter((player) => player.id !== client.id)
      );

      // If room is empty, remove room and game controller
      if (this.rooms.get(roomId)?.length === 0) {
        this.rooms.delete(roomId);
        this.games.delete(roomId);
      } else {
        // If room is not empty, notify the other player of the disconnect
        console.warn('Player disconnected:', client.id);
        players.forEach((player) => {
          if (player.id !== client.id) {
            player.emit(BaseGatewayEvents.PLAYER_DISCONNECT, {
              playerId: client.id,
            });
          }
        });

        // Set a timeout for reconnection
        setTimeout(() => {
          // Check if the connectedPlayers is more than Minimum players for game, otherwise delete room
          const roomPlayers = this.rooms.get(roomId);
          if (roomPlayers && roomPlayers.length < this.minPlayerForGame) {
            this.rooms.delete(roomId);
            this.games.delete(roomId);
            this.server.to(roomId).emit(BaseGatewayEvents.GAME_OVER, {
              reason: 'Not enough players to continue the game.',
            });
          }
        }, this.TIME_FOR_RECONNECTION_IN_MS); // 30 seconds for reconnection
      }
    });

    console.log(`Client disconnected: ${client.id}`);
  }

  //
  // Handle Outgoing messages for controllers
  //

  public broadcastToRoom(roomId: string, event: string, data: any): void {
    this.server.to(roomId).emit(event, data);
  }

  public broadcastToPlayer(playerId: string, event: string, data: any): void {
    this.server.to(playerId).emit(event, data);
  }

  //
  // Handle incoming messages
  //

  @SubscribeMessage(BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE)
  getPlayerQueue(@MessageBody() clientId: string): void {
    console.log('Return num of Queue: ', this.queue.length);
    this.server
      .to(clientId)
      .emit(BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE, this.queue.length);
  }

  @SubscribeMessage(RPSGameEvents.CHANGE_CHOICE)
  handleChangeChoice(
    @MessageBody() data: { choice: RPSChoicesEnum; roomId: string },
    @ConnectedSocket() client: Socket
  ): void {
    let roomId;
    if (!data.roomId) {
      console.warn('No roomId provided. Attempting to find room for client.');
      roomId = Array.from(this.rooms.entries()).find(([, players]) =>
        players.includes(client)
      )?.[0];
    } else {
      console.log('[DEBUG] RoomId provided:', data.roomId);
      roomId = data.roomId;
    }

    if (!roomId) {
      console.error('Client is not part of any room.');
      return;
    }

    const game = this.games.get(roomId);
    if (game) {
      game.changeChoice(client.id, data.choice);
    } else {
      console.error(`No game controller found for room: ${roomId}`);
      console.warn('Closing room:', roomId);
      try {
        this.closeGameRoom(roomId);
      } catch (error) {
        console.error('Error closing room');
        client.emit(BaseGatewayEvents.GAME_OVER, {});
      }
    }
  }

  private closeGameRoom(roomId: string): void {
    const players = this.rooms.get(roomId);
    if (!players) {
      console.error(`Room ${roomId} not found.`);
      throw new Error(`Room ${roomId} not found.`);
      return;
    }

    players.forEach((player) => {
      player.leave(roomId);
      this.broadcastToPlayer(player.id, BaseGatewayEvents.GAME_OVER, {
        reason: 'Game room closed.',
      });
    });
    this.rooms.delete(roomId);
    this.games.delete(roomId);
  }
}
