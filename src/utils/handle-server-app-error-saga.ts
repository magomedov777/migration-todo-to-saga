import { put } from 'redux-saga/effects'
import {ResponseType} from '../api/todolists-api'
import { setAppErrorAC, setAppStatusAC } from '../app/app-reducer'


export function* handleServerAppErrorSaga<D>(data: ResponseType<D>){
    if (data.messages.length) {
        yield put(setAppErrorAC(data.messages[0]))
    } else {
        yield put(setAppErrorAC('Some error occurred'))
    }
    yield put(setAppStatusAC('failed'))
}