import { put } from "redux-saga/effects"
import { setAppErrorAC, setAppStatusAC } from "../app/app-reducer"

export function* handleServerNetworkErrorSaga (error: { message: string }){
    yield put(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    yield put(setAppStatusAC('failed'))
}