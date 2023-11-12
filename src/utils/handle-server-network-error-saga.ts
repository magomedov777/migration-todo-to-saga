import { put } from "redux-saga/effects"
import { setAppErrorAC, setAppStatusAC } from "../app/app-reducer"

/**

Handles server network error saga.
@generator
@param {Object} error - The error object.
@param {string} error.message - The error message.
@yields {object} - The put effect to dispatch setAppErrorAC action.
@yields {object} - The put effect to dispatch setAppStatusAC action.
**/

export function* handleServerNetworkErrorSaga (error: { message: string }){
    yield put(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    yield put(setAppStatusAC('failed'))
}