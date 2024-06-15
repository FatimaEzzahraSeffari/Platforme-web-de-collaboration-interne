const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Address of your React frontsend
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (data) => {
        console.log('Message received:', data);

        try {
            const { content, type, receiverId, file } = data;
            const formData = new FormData();
            formData.append('content', content);
            formData.append('type', type);
            formData.append('receiverId', receiverId.toString());
            if (file) {
                formData.append('file', file);
            }

            console.log('Sending formData to Laravel...');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await axios.post('http://localhost:8000/api/messages', formData, {
                headers: formData.getHeaders(),
            });

            console.log('Message stored:', response.data);

            io.emit('receiveMessage', response.data);
        } catch (error) {
            console.error('Error storing message:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
