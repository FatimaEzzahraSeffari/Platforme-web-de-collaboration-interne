import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Backend server address

const socket = io(SOCKET_URL);

export const sendMessage = (data) => {
    socket.emit('sendMessage', data);
};

export const onMessageReceived = (callback) => {
    socket.on('receiveMessage', callback);
};

export default {
    sendMessage,
    onMessageReceived,
};
