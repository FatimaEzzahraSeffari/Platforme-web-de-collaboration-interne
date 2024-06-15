import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Laravel API address

// Function to add a reaction to a message
const addOrUpdateReaction = async (messageId: number, emoji: string, receiverId: number) => {
    try {
        const response = await axios.post(`${API_URL}/reactions`, {
            message_id: messageId,
            emoji: emoji,
            receiver_id: receiverId,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add or update reaction', error);
        throw error;
    }
};

// Function to fetch reactions for a specific message
export const fetchReactions = async (messageId: number) => {
    try {
        const response = await axios.get(`${API_URL}/messages/${messageId}/reactions`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching reactions:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Exporting all functions as the default export
export default {
    addOrUpdateReaction,
    fetchReactions,
};
