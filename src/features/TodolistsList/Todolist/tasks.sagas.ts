import { call, put, select, takeEvery } from "redux-saga/effects"
import { setAppStatusAC } from "../../../app/app-reducer"
import { UpdateDomainTaskModelType, addTaskAC, removeTaskAC, setTasksAC, updateTaskAC } from "../tasks-reducer"
import { GetTasksResponse, ResponseType, UpdateTaskModelType, todolistsAPI } from "../../../api/todolists-api"
import { AxiosResponse } from "axios"
import { AppRootStateType } from "../../../state/store"
import { handleServerAppErrorSaga, handleServerNetworkErrorSaga } from "../../../utils"

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
    const res: AxiosResponse = yield call(todolistsAPI.createTask, action.todolistId, action.title)
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                yield put(addTaskAC(task))
                yield put(setAppStatusAC('succeeded'))

            } else {
                yield handleServerAppErrorSaga(res.data);
            }
        }catch(error: any){
                yield handleServerNetworkErrorSaga(error)
            }
        }

export const addTasks = (title: string, todolistId: string) => ({type: "TASKS/ADD-TASKS", title, todolistId})


export function* updateTaskWorkerSaga(
    action: ReturnType<typeof updateTasks>
) {
  try {
    const state: AppRootStateType = yield select((state: AppRootStateType) => state);
    const task = state.tasks[action.todolistId].find((t) => t.id === action.taskId);
    if (!task) {
      return;
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...action.domainModel
    };

    const res:AxiosResponse  = yield call(todolistsAPI.updateTask, action.todolistId, action.taskId, apiModel);
    if (res.data.resultCode === 0) {
      yield put(updateTaskAC(action.taskId, action.domainModel, action.todolistId));
    } else {
      yield call(handleServerAppErrorSaga, res.data);
    }
  } catch (error: any) {
    yield call(handleServerNetworkErrorSaga, error);
  }
}

export const updateTasks = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => ({type: "TASKS/UPDATE-TASKS", taskId, domainModel, todolistId})











export function* taskWatcherSaga() {
    yield takeEvery("TASKS/FETCH-TASKS", fetchTasksWorkerSaga)
    yield takeEvery("TASKS/REMOVE-TASKS", removeTaskWorkerSaga)
    yield takeEvery("TASKS/ADD-TASKS", addTaskWorkerSaga)
    yield takeEvery("TASKS/UPDATE-TASKS", updateTaskWorkerSaga)

}











