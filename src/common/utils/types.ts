import { rootReducer, store } from 'app/store'
import { FieldErrorType } from '../types/types'

export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch
export type ThunkError = { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }
