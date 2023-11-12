import { put } from 'redux-saga/effects'
import {ResponseType} from '../api/todolists-api'
import { setAppErrorAC, setAppStatusAC } from '../app/app-reducer'

/**

Handles server app error saga.
@generator
@template D - The type of the response data.
@param {ResponseType<D>} data - The response data object.
@yields {object} - The put effect to dispatch setAppErrorAC action.
@yields {object} - The put effect to dispatch setAppStatusAC action.
**/

export function* handleServerAppErrorSaga<D>(data: ResponseType<D>){
    if (data.messages.length) {
        yield put(setAppErrorAC(data.messages[0]))
    } else {
        yield put(setAppErrorAC('Some error occurred'))
    }
    yield put(setAppStatusAC('failed'))
}