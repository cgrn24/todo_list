import { combineReducers } from 'redux'
import { appReducer } from '../features/Application'
import { tasksReducer, todolistsReducer } from '../features/TodolistsList'
import { authReducer } from '../features/Auth'

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})
