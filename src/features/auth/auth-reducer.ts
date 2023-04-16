import {authAPI, LoginParamsType} from 'api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";
import {appAction} from "app/app-reducer";


// const initialState: InitialStateType = {
//     isLoggedIn: false
// }
// export type InitialStateType = typeof initialState
const slice = createSlice({
    name:'auth',
    initialState:{
        isLoggedIn: false
    },
    reducers:{
        setIsLoggedIn:(state, action:PayloadAction<{isLoggedIn:boolean}>)=>{

            state.isLoggedIn = action.payload.isLoggedIn
            //return {...state, isLoggedIn: action.value}
        }
    }
})
export const authReducer = slice.reducer
export const authActions = slice.actions

export const loginTC = (data: LoginParamsType):AppThunk => (dispatch) => {
    dispatch(appAction.setAppStatus({status:'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn:true}))
                dispatch(appAction.setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = ():AppThunk => (dispatch) => {
    dispatch(appAction.setAppStatus({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn:false}))
                dispatch(appAction.setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}



