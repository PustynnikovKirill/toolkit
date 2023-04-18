import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {appAction, RequestStatusType} from 'app/app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {AppThunk} from 'app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        removeTodolist:(state, action:PayloadAction<{id: string}>)=>{
        const index = state.findIndex(todo => todo.id === action.payload.id)  //findIndex - как find только возвращает индекс
            if (index !== -1) state.splice(index, 1)  //удаляем по индексу один элемент
        },
        addTodolist:(state, action:PayloadAction<{todolist: TodolistType}>)=>{
            const newTodoList : TodolistDomainType= {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            state.unshift(newTodoList)  //unshift - как push только в начало
        },
        changeTodolistTitle:(state, action:PayloadAction<{ id: string, title: string }>)=>{
          const todo = state.find(todo => todo.id === action.payload.id)//findIndex - как find только возвращает индекс
            if (todo) {
                todo.title = action.payload.title
            }
        },
        changeTodolistFilter:(state, action:PayloadAction<{id: string, filter: FilterValuesType}>)=> {
            const todo = state.find(todo => todo.id === action.payload.id)//findIndex - как find только возвращает индекс
            if (todo) {
                todo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus:(state, action:PayloadAction<{ id: string, entityStatus: RequestStatusType }>)=>{
            const todo = state.find(todo => todo.id === action.payload.id)//findIndex - как find только возвращает индекс
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
            // return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        },
        setTodolists:(state, action:PayloadAction<{todolists:TodolistType[]}>)=>{
            return  action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
    },
    extraReducers: builder => {
        builder
            .addCase(clearTasksAndTodolists, ()=> {
                return []
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// action
// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appAction.setAppStatus({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({todolists:res.data}))
                dispatch(appAction.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appAction.setAppStatus({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(todolistsActions.changeTodolistEntityStatus({id:todolistId, entityStatus:'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistsActions.removeTodolist({id:todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(appAction.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appAction.setAppStatus({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolist({todolist:res.data.data.item}))
                dispatch(appAction.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string):AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitle({id, title}))
            })
    }
}

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
