import { ThunkDispatch } from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import { AnyAction, combineReducers } from 'redux'
import { appReducer } from './app-reducer'
import { authReducer } from 'features/auth/auth-reducer'
import { tasksReducer } from 'features/todolists-list/tasks/tasks-reducer'
import { todolistsReducer } from 'features/todolists-list/todolists/todolists-reducer'

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./store', () => {
    store.replaceReducer(rootReducer)
  })
}
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store
