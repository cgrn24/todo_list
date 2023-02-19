import { store } from '../app/store'
import { rootReducer } from '../app/rootReducer'
import { FieldErrorType } from '../api/types'

// redux common types
export type RootReducerType = typeof rootReducer
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch
export type ThunkError = { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }
