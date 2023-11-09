import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk'
import {appReducer} from './app-reducer'
import createSagaMiddleware from 'redux-saga';
import {takeEvery, put} from 'redux-saga/effects';
import { addTaskWorkerSaga, fetchTasksWorkerSaga, removeTaskWorkerSaga, taskWatcherSaga } from '../features/TodolistsList/Todolist/tasks.sagas';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
});

const sagaMiddleware = createSagaMiddleware()

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware));
export type AppRootStateType = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield taskWatcherSaga()

}




export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store;
