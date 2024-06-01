// this module is to test the queue-here server

const io = require('socket.io-client');
const socket = io('http://localhost:5000/');

const members = [
  {
    id: '1c0d09b4-2cf3-4c1d-8c1c-f1f8a1541a98',
    queueId: '0bbcef9a-6b3a-472f-8890-8993185b98d7',
    userId: 'f87055d8-bd92-4b88-93c8-5e7dfc05632d',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    active: true,
    position: 42,
    createdAt: '2023-02-15T10:00:00.000Z',
    updatedAt: '2024-05-25T12:00:00.000Z',
  },
  {
    id: '9e5b1e70-92c4-414b-bc7e-728d9b56f87e',
    queueId: '7e99e633-4d65-4e43-a4a5-27d3c9e25577',
    userId: 'a8a5ff3c-8304-4cd7-a0a7-c6784c287a87',
    image: null,
    active: false,
    position: null,
    createdAt: '2021-11-10T09:00:00.000Z',
    updatedAt: '2024-05-26T11:00:00.000Z',
  },
];

module.exports = {
  socket,
  members,
};

const test = async () => {
  socket.emit('update_room', members);

  socket.on('room_update', (data) => {
    console.log(data);
  });
  return () => {
    socket.off('room_update');
  };
};

test();
