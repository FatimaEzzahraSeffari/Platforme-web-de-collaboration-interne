import { profileFailed, profileSuccess } from "./reducer"
import { RootState } from "slices";
import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";

interface User {
    username: string;
    idx: number;
}

export const editProfile = (user: User
): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
    
}