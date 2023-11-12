import { call, put, takeEvery } from "redux-saga/effects"
import { setAppStatusAC } from "../../app/app-reducer"
import { TodolistType, todolistsAPI, ResponseType } from "../../api/todolists-api"
import { setTodolistsAC } from "./todolists-reducer"

export function* fetchTodolistsWorkerSaga(action: ReturnType<typeof fetchTodolists>){
        yield put(setAppStatusAC('loading'))
        const res: ResponseType<TodolistType[]> = yield call(todolistsAPI.getTodolists)
                yield put(setTodolistsAC(res.data))
                yield put(setAppStatusAC('succeeded'))
    }

export const fetchTodolists = () => ({type: "TODOLISTS/FETCH-TODOLISTS"})

export function* todolistsWatcherSaga() {
    yield takeEvery("TODOLISTS/FETCH-TODOLISTS", fetchTodolistsWorkerSaga)
}