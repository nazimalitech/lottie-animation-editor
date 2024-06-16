import { io, Socket } from 'socket.io-client';

class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4000');
  }

  joinRoom(roomId: string) {
    this.socket.emit('join', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leave', roomId);
  }

  sendUpdate(roomId: string, updateData: any) {
    this.socket.emit('update', { roomId, updateData });
  }

  onUpdate(callback: (data: any) => void) {
    this.socket.on('update', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();
export default socketService;
