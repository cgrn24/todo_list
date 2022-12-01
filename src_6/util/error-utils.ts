import {setError, setStatus} from "../app/app-reducer";
import {AppThunkDispatch} from "../app/store";
import {ResponseType} from '../api/todolists-api'

export const handleServerNetworkError = (error: string , dispatch: AppThunkDispatch) => {
    dispatch(setStatus('failed'))
    dispatch(setError(error))
}


export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: AppThunkDispatch) => {
    if (data.messages.length) {
        dispatch(setError(data.messages[0]))
    } else {
        dispatch(setError('Some error'))
    }
    dispatch(setStatus('failed'))
}


const testFunction = (arg: string[] | number[] | object[] | object): string[] | number[] | object[] | object => {
    //
    //
    //
    //
    return arg
}

const res = testFunction(['2','3','5'])

function identity<T>(arg: T): T {
    return arg;
}

const res2 = identity<string[]>(['2','3','5'])
const res3 = identity({name: 'Den', city: 'Minsk'})

res2.map(el => el)
res3.name