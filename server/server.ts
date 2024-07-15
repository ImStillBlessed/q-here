declare var require: any;

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('create_room', (data: any) => {
    console.log('User created room:', data);
  });

  socket.on('update_room', (data: any) => {
    console.log('User updated room:', data);
    io.emit('room_update', data);
  });

  socket.on('member_leave', async (data: { id: string }) => {
    console.log('Member left:', data);
    // Update the member's active status in the database

    io.emit('room_update', data);
  });

  // socket.on('update_room', (data) => {
  //   console.log('User updated room:', data);
  //   socket.broadcast.emit('room_update', data);
  //   // io.to(data.roomId).emit('room_update', data);
  // });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});
