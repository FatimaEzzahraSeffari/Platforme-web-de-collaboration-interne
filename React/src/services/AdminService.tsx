import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api/';

export interface User {
    length: number;
    id: number;
    email: string;
    country_code: string;
    phone: string;
    name: string;
    role: string;
    service: string;
    profile_image: string | null;
    online: boolean;
    created_at: string;
  }
  export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name: string;
    subject: string;
    comments: string;
}
// Fonction de déconnexion
export const logoutUser = async (userId: number) => {
    try {
      const response = await axios.post(`${API_URL}logout`, { userId });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "An error occurred during logout.");
      } else {
        throw new Error("An error occurred during logout.");
      }
    }
  };
  
  // Edit users
  export const updateUser = async (data: User) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('country_code', data.country_code);
      formData.append('phone', data.phone);
      formData.append('role', data.role);
      formData.append('service', data.service);
      formData.append('created_at', data.created_at);
      if (data.profile_image && typeof data.profile_image !== 'string') {
        formData.append('profile_image', data.profile_image);
      }
  
      const response = await axios.post(`${API_URL}admin/user/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

  
      return response.data.user; // Ensure to return the updated user data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "An error occurred during the update.");
      } else {
        throw new Error("An error occurred during the update.");
      }
    }
  };
  //delete user 
  export const deleteUser = async (userId: number) => {
    try {
      const response = await axios.delete(`${API_URL}admin/user/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || "An error occurred during deletion.");
      } else {
        throw new Error("An error occurred during deletion.");
      }
    }
  };
  export const updateContact = async (data: Contact) => {
    try {
        const response = await axios.post(`${API_URL}admin/contact/${data.id}`, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || "An error occurred during the update.");
        } else {
            throw new Error("An error occurred during the update.");
        }
    }
};

export const deleteContact = async (contactId: number) => {
    try {
        const response = await axios.delete(`${API_URL}admin/contact/${contactId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || "An error occurred during deletion.");
        } else {
            throw new Error("An error occurred during deletion.");
        }
    }
};

  export default {
    updateUser,
    deleteUser,
    updateContact,
    deleteContact
  };

