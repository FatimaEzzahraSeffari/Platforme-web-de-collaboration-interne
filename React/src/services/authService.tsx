import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Ajustez selon l'URL de votre API
interface LoginResponseData {
  token: string;
  is_admin: boolean;
  category: string; 

}

interface ErrorResponse {
  message: string;
  errors?: {
      [key: string]: string[];
  };
}

interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthData {
    email: string;
    password: string;
    password_confirmation: string;
    country_code: string; // Assurez-vous que le nom du champ correspond
    phone: string;
    name: string;
    role_id: number; // Assurez-vous que cette ligne existe dans l'interface AuthData
    service_id: number; // De même pour celle-ci
    profile_image: File | null; // Permettre que profile_image soit File ou null
   
  }
  
 
  
  export interface User {
    id: number;
    email: string;
    country_code: string;
    phone: string;
    name: string;
    role: string;
    service: string;
    profile_image: File | null;
  }
  
  
// Fonction pour l'enregistrement d'un utilisateur
// Assurez-vous que vous avez défini `AuthData` pour inclure tous les champs attendus, y compris l'image de profil comme une chaîne (si vous convertissez l'image en base64).

export const register = async (data: AuthData | FormData) => {
  try {
    const headers = (data instanceof FormData) 
      ? { 'Content-Type': 'multipart/form-data' } 
      : { 'Content-Type': 'application/json' };

    const response = await axios.post(`${API_URL}register`, data, { headers });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      
    }
    
    return response.data;
  } catch (error) {
    // La gestion des erreurs reste la même
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Une erreur est survenue lors de l'enregistrement.");
    } else {
      throw new Error("Une erreur est survenue lors de l'enregistrement.");
    }
  }
};




export const login = async (credentials: LoginCredentials): Promise<LoginResponseData> => {
  try {
      const response = await axios.post<LoginResponseData>(`${API_URL}login`, credentials);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
  } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          const errorMessage = (error.response.data as ErrorResponse).message || "An unexpected error occurred during login.";
          throw new Error(errorMessage);
      } else {
          throw new Error("An unexpected error occurred during the login process.");
      }
  }
};



// Fonctions pour récupérer les rôles et les services
export const Role = async () => {
  const response = await axios.get(`${API_URL}roles`);
  return response.data;
};

export const Service = async () => {
  const response = await axios.get(`${API_URL}services`);
  return response.data;
};

//recuper users 
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}users`);
    return response.data.users; // Assurez-vous que la réponse de l'API est structurée correctement
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Une erreur est survenue lors de la récupération des utilisateurs.");
    } else {
      throw new Error("Une erreur est survenue lors de la récupération des utilisateurs.");
    }
  }
};
//logout
export const logout = async () => {
  try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;

      if (token) {
          await axios.post(`${API_URL}logout`, null, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
      }

      localStorage.removeItem('user');
  } catch (error) {
      console.error('Error logging out:', error);
      throw new Error("An error occurred during logout.");
  }
};
//Edit
export const updateUser = async (data: User) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('country_code', data.country_code);
    formData.append('phone', data.phone);
    formData.append('role', data.role);
    formData.append('service', data.service);
    if (data.profile_image) {
      formData.append('profile_image', data.profile_image);
    }

    const response = await axios.post(`${API_URL}user/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.user; // Assurez-vous de retourner les données de l'utilisateur mis à jour
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "An error occurred during the update.");
    } else {
      throw new Error("An error occurred during the update.");
    }
  }
};

const getUserById = async (userId: number) => {
  try {
      const response = await axios.get(`${API_URL}user/${userId}`);
      return response.data;
  } catch (error) {
      if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data.message || "An error occurred while fetching the user.");
      } else {
          throw new Error("An error occurred while fetching the user.");
      }
  }
};


// Exportation de toutes les fonctions pour utilisation dans d'autres fichiers
export default {
  register,
  login,
  logout,
  Role,
  Service,
  getUsers,
  updateUser,
  getUserById
  
};
