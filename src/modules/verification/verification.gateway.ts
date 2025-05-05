import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Adjust CORS for your front-end application
    },
    // You might want to specify a namespace or port
    // namespace: '/verification',
    // port: 3001,
  })
  export class VerificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('VerificationGateway');
  
    // Store a mapping of verificationId to connected employer client IDs
    // In a real app, manage this more robustly, potentially with rooms
    private verificationClientMap: Map<string, string> = new Map();
  
    handleConnection(client: Socket, ...args: any[]) {
      this.logger.log(`Client connected: ${client.id}`);
      // You might want to authenticate the client here and associate them with an employer
      // For this example, we'll assume the employer client sends a message to register for updates
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      // Remove client from verificationClientMap if they were registered
      this.verificationClientMap.forEach((clientId, verificationId) => {
        if (clientId === client.id) {
          this.verificationClientMap.delete(verificationId);
        }
      });
    }
  
    // Example: Employer client sends a message to register for updates for a specific verification
    @SubscribeMessage('registerForVerificationUpdates')
    handleRegisterForUpdates(client: Socket, verificationId: string): void {
      this.logger.log(`Client ${client.id} registering for updates for verification: ${verificationId}`);
      this.verificationClientMap.set(verificationId, client.id);
      // Optional: Send current status if verification already exists
    }
  
  
    // Method called by the service to emit the approval event
    handleVerificationApproved(verificationId: string, status: 'approved' | 'rejected'): void {
      const clientId = this.verificationClientMap.get(verificationId);
      if (clientId) {
        this.logger.log(`Emitting verification update for ${verificationId} to client ${clientId}`);
        this.server.to(clientId).emit('verificationStatusUpdate', {
          verification_id: verificationId,
          status: status,
          message: `Verification ${status}!`,
        });
      } else {
         this.logger.warn(`No client registered for verification ID: ${verificationId}`);
         // In a real app, you might have a fallback mechanism or store events
      }
    }
  }
  