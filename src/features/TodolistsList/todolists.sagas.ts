import { call, put, takeEvery } from "redux-saga/effects"
import { setAppStatusAC } from "../../app/app-reducer"
import { TodolistType, todolistsAPI, ResponseType } from "../../api/todolists-api"
import { changeTodolistEntityStatusAC, removeTodolistAC, setTodolistsAC } from "./todolists-reducer"

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


export function* todolistsWatcherSaga() {
    yield takeEvery("TODOLISTS/FETCH-TODOLISTS", fetchTodolistsWorkerSaga)
    yield takeEvery("TODOLISTS/REMOVE-TODOLISTS", removeTodolistWorkerSaga)

}