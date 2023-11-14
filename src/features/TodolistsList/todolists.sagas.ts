import { call, put, takeEvery } from "redux-saga/effects"
import { setAppStatusAC } from "../../app/app-reducer"
import { TodolistType, todolistsAPI, ResponseType } from "../../api/todolists-api"
import { addTodolistAC, changeTodolistEntityStatusAC, changeTodolistTitleAC, removeTodolistAC, setTodolistsAC } from "./todolists-reducer"
import { AxiosResponse } from "axios"

export function* fetchTodolistsWorkerSaga(action: ReturnType<typeof fetchTodolists>){
        yield put(setAppStatusAC('loading'))
        const res: ResponseType<TodolistType[]> = yield call(todolistsAPI.getTodolists)
                yield put(setTodolistsAC(res.data))
                yield put(setAppStatusAC('succeeded'))
    }

export const fetchTodolists = () => ({type: "TODOLISTS/FETCH-TODOLISTS"})


export function* removeTodolistWorkerSaga (action: ReturnType<typeof removeTodolistWS>) {
        yield put(setAppStatusAC('loading'))
        yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
        const res: ResponseType = yield call(todolistsAPI.deleteTodolist, action.todolistId)
        yield put(removeTodolistAC(action.todolistId))
        yield put(setAppStatusAC('succeeded'))
}

export const removeTodolistWS = (todolistId: string) => ({type: "TODOLISTS/REMOVE-TODOLISTS", todolistId})


export function* addTodolistWorkerSaga(action: ReturnType<typeof addTodolistWS>) {
        yield put(setAppStatusAC('loading'))
        const res: AxiosResponse = yield call(todolistsAPI.createTodolist, action.title)
                yield put(addTodolistAC(res.data.data.item))
                yield put(setAppStatusAC('succeeded'))
    }

export const addTodolistWS = (title: string) => ({type: "TODOLISTS/ADD-TODOLISTS", title})


export function* changeTodolistTitleWorkerSaga (action: ReturnType<typeof changeTodolistTitleWS>) {
        const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.updateTodolist, action.id, action.title)
                yield put(changeTodolistTitleAC(action.id, action.title))
    }

export const changeTodolistTitleWS = (id: string, title: string) => ({type: "TODOLISTS/CHANGE-TODOLIST-TITLE", id, title})



export function* todolistsWatcherSaga() {
    yield takeEvery("TODOLISTS/FETCH-TODOLISTS", fetchTodolistsWorkerSaga)
    yield takeEvery("TODOLISTS/REMOVE-TODOLISTS", removeTodolistWorkerSaga)
    yield takeEvery("TODOLISTS/ADD-TODOLISTS", addTodolistWorkerSaga)
    yield takeEvery("TODOLISTS/CHANGE-TODOLIST-TITLE", changeTodolistTitleWorkerSaga)
    

}