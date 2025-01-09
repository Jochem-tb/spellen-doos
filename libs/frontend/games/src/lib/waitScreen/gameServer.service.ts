import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser, ProfilePictureEnum, UserRole } from '@spellen-doos/shared/api';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class GameServerService {
  constructor() {
    console.log('Service constructor aanroepen');
    this.initializeSocket();
  }

  //TESTING SOCKETS
  private socket = io('http://localhost:3000/rpsGameServerGateway');

  public sendMessage(message: string): void {
    this.socket.emit('message', {
      userId: '12345',
      message: message,
    });
  }

  private initializeSocket(): void {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
    this.socket.on('connect', () => {
      console.log('Connected to the control hub:', this.socket.id);

      // Send a message
      this.socket.emit('message', {
        userId: '12345',
        message: 'Hello, server!',
      });

      this.socket.emit('changeChoice', { data: 'Hello, server!' });

      // Listen for responses
      this.socket.on('response', (data) => {
        console.log('Server response:', data);
      });
    });

    // Handle disconnection
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the control hub');
    });
  }
}
