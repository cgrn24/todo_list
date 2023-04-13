import thunkMiddleware from 'redux-thunk'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { tasksReducer, todolistsReducer } from 'features/TodolistsList'
import { appReducer } from 'app'
import { authReducer } from 'features/Auth'

// непосредственно создаём store
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))
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

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./store', () => {
    store.replaceReducer(rootReducer)
  })
}
