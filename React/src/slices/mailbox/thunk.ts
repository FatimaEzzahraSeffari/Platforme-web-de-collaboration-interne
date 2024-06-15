import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods


export const getMail = createAsyncThunk("mailbox/getMail", async () => {
 
});

export const unreadMail = createAsyncThunk("mailbox/unreadMail", async (mail: any) => {
  
});

export const staredMail = createAsyncThunk("mailbox/staredMail", async (mail: any) => {
  
});

export const trashMail = createAsyncThunk("mailbox/trashMail", async (mail: any) => {
  
});

export const deleteMail = createAsyncThunk("mailbox/deleteMail", async (mail: any) => {
  
});