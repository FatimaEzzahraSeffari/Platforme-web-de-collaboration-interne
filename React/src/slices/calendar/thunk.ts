import { createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getEvents = createAsyncThunk("calendar/getEvents", async () => {
    
});
export const addEvents = createAsyncThunk("calendar/addEvents", async (event: any) => {
   
});
export const updateEvents = createAsyncThunk("calendar/updateEvents", async (event: any) => {
   
});
export const deleteEvents = createAsyncThunk("calendar/deleteEvents", async (event: any) => {
    
});

export const getCategory = createAsyncThunk("calendar/getCategory", async () => {
    
});

export const deleteCategory = createAsyncThunk("calendar/deleteCategory", async (event: any) => {
    
});