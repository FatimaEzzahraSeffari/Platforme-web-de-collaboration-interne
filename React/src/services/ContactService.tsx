import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api/';

export interface ContactData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name: string;
    subject: string;
    comments: string;
}

export const sendContactMessage = async (data: ContactData) => {
    try {
        const response = await axios.post(`${API_URL}contacts`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || "An error occurred while sending the message.");
        } else {
            throw new Error("An error occurred while sending the message.");
        }
    }
};
export const fetchContacts = async () => {
    try {
        const response = await axios.get(`${API_URL}contacts`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || "An error occurred while fetching contacts.");
        } else {
            throw new Error("An error occurred while fetching contacts.");
        }
    }
};

export default {
    sendContactMessage,
    fetchContacts,
}