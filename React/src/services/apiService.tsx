import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Laravel API address

export const sendApiMessage = async (content: string, type: string, receiverId: number, file: File | null = null) => {
    try {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('type', type);
        formData.append('receiver_id', receiverId.toString()); // Ensure the key matches Laravel's expectation
        if (file) {
            formData.append('file', file);
        }

        const response = await axios.post(`${API_URL}/messages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error:any) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        throw error;
    }
};
// Function to fetch messages from the API
export const fetchMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/messages`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        throw error;
    }
};
// Function to delete a message
export const deleteMessage = async (messageId:any, deleteFor:any) => {
    try {
        const response = await axios.delete(`${API_URL}/messages/${messageId}`, {
            params: { deleteFor }
        });
        return response.data;
    } catch (error:any) {
        console.error('Error deleting message:', error.response ? error.response.data : error.message);
        throw error;
    }
};
// Edit a specific messages
export const editMessage = async (messageId:number, messageData:any) => {
    const response = await axios.put(`${API_URL}/messages/${messageId}`, messageData);
    return response.data;
};

//reply 
export const replyToMessage = async (messageId: number, content: string, replyTo: number, userId: number, receiverId: number, type: string) => {
    const response = await axios.post(`${API_URL}/messages/${messageId}/reply`, {
        content,
        reply_to: replyTo,
        user_id: userId,
        receiver_id: receiverId,
        type, // Inclure le type de message
    });
    return response.data;
};



  
  export default {
    sendApiMessage,
    fetchMessages,
    deleteMessage,
    editMessage,
    replyToMessage,
   
  };
