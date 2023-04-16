import thunkMiddleware from 'redux-thunk'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { tasksReducer, todolistsReducer } from 'features/TodolistsList'
import { appReducer } from 'app'
import { authReducer } from 'features/Auth'

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
})

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./store', () => {
    store.replaceReducer(rootReducer)
  })
}
export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch

// @ts-ignore
window.store = store
