import { call, put, takeEvery } from "redux-saga/effects"
import { setAppStatusAC } from "../../../app/app-reducer"
import { addTaskAC, removeTaskAC, setTasksAC } from "../tasks-reducer"
import { GetTasksResponse, ResponseType, todolistsAPI } from "../../../api/todolists-api"
import { AxiosResponse } from "axios"
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga } from "../../../utils/error-utils"

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<GetTasksResponse>  = yield call(todolistsAPI.getTasks, action.todolistId)
    const tasks = res.data.items
    yield put(setTasksAC(tasks, action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}

export const fetchTasks = (todolistId: string) => ({type: "TASKS/FETCH-TASKS", todolistId})

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTasks>){
    const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
           yield put(removeTaskAC(action.taskId, action.todolistId))
}

export const removeTasks = (taskId: string, todolistId: string) => ({type: "TASKS/REMOVE-TASKS", taskId, todolistId})

export function* addTaskWorkerSaga(action: ReturnType<typeof addTasks>){
    yield put(setAppStatusAC('loading'))
    try{
    const res: AxiosResponse = yield call(todolistsAPI.createTask, action.title, action.todolistId)
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                yield put(addTaskAC(task))
                yield put(setAppStatusAC('succeeded'))

            } else {
                yield handleServerAppErrorSaga(res.data);
            }}catch(error: any){
                yield handleServerNetworkErrorSaga(error)
            }
        }

export const addTasks = (title: string, todolistId: string) => ({type: "TASKS/ADD-TASKS", title, todolistId})

export function* taskWatcherSaga() {
    yield takeEvery("TASKS/FETCH-TASKS", fetchTasksWorkerSaga)
    yield takeEvery("TASKS/REMOVE-TASKS", removeTaskWorkerSaga)
    yield takeEvery("TASKS/ADD-TASKS", addTaskWorkerSaga)
}











