import { createAsyncThunk } from "@reduxjs/toolkit";


import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getNotes = createAsyncThunk("notes/getNotes", async () => {
    
});
export const addNotes = createAsyncThunk("notes/addNotes", async (event: any) => {
    
});
export const updateNotes = createAsyncThunk("notes/updateNotes", async (event: any) => {
    
});
export const deleteNotes = createAsyncThunk("notes/deleteNotes", async (event: any) => {
    
});