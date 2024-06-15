import { createAsyncThunk } from "@reduxjs/toolkit";


import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getUserList = createAsyncThunk("users/getUserList", async () => {
    
});
export const addUserList = createAsyncThunk("users/addUserList", async (event: any) => {
    
});
export const updateUserList = createAsyncThunk("users/updateUserList", async (event: any) => {
    
});
export const deleteUserList = createAsyncThunk("users/deleteUserList", async (event: any) => {
    
});

export const getUserGrid = createAsyncThunk("users/getUserGrid", async () => {
    
});
export const addUserGrid = createAsyncThunk("users/addUserGrid", async (event: any) => {
    
});
export const updateUserGrid = createAsyncThunk("users/updateUserGrid", async (event: any) => {
    
});
export const deleteUserGrid = createAsyncThunk("users/deleteUserGrid", async (event: any) => {
    
});
