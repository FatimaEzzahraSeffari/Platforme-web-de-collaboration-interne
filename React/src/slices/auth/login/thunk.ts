import { loginError, loginSuccess, logoutSuccess } from "./reducer";
import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";
import { RootState } from "slices";


interface User {
    email: string;
    password: string;
}

export const loginUser = (
    user: User,
    history: any
): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
    
};

export const logoutUser = () => async (dispatch: Dispatch) => {
    
}


export const socialLogin = (type: any, history: any) => async (dispatch: any) => {
    
}