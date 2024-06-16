import React, { useEffect } from 'react';
import socketService from '../socketService';

const RoomComponent: React.FC<{ roomId: string }> = ({ roomId }) => {
  useEffect(() => {
    socketService.joinRoom(roomId);

    socketService.onUpdate((data) => {
      console.log('Received update:', data);
    });

    return () => {
      socketService.leaveRoom(roomId);
    };
  }, [roomId]);

  const sendUpdate = (updateData: any) => {
    socketService.sendUpdate(roomId, updateData);
  };

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <button onClick={() => sendUpdate({ message: 'Hello, World!' })}>
        Send Update
      </button>
    </div>
  );
};

export default RoomComponent;
