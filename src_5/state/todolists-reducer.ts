import { todolistsAPI } from './../api/todolists-api'
import { AccessTimeOutlined } from '@mui/icons-material'
import { v1 } from 'uuid'
import { TodolistType } from '../api/todolists-api'
import { Dispatch } from 'redux'

export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST'
  id: string
}
export type AddTodolistActionType = {
  type: 'ADD-TODOLIST'
  title: string
  todolistId: string
}
export type ChangeTodolistTitleActionType = {
  type: 'CHANGE-TODOLIST-TITLE'
  id: string
  title: string
}
export type ChangeTodolistFilterActionType = {
  type: 'CHANGE-TODOLIST-FILTER'
  id: string
  filter: FilterValuesType
}

export type SetTodoListsType = {
  type: 'SET-TODOS'
  todoLists: TodolistType[]
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType | SetTodoListsType

const initialState: Array<TodolistDomainType> = [
  /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST': {
      return state.filter((tl) => tl.id !== action.id)
    }
    case 'ADD-TODOLIST': {
      return [
        {
          id: action.todolistId,
          title: action.title,
          filter: 'all',
          addedDate: '',
          order: 0,
        },
        ...state,
      ]
    }
    case 'CHANGE-TODOLIST-TITLE': {
      const todolist = state.find((tl) => tl.id === action.id)
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.title = action.title
      }
      return [...state]
    }
    case 'CHANGE-TODOLIST-FILTER': {
      const todolist = state.find((tl) => tl.id === action.id)
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.filter = action.filter
      }
      return [...state]
    }

    case 'SET-TODOS': {
      return action.todoLists.map((tl) => ({ ...tl, filter: 'all' }))
    }
    default:
      return state
  }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
  return { type: 'REMOVE-TODOLIST', id: todolistId }
}
export const addTodolistAC = (title: string, todolistId: string): AddTodolistActionType => {
  return { type: 'ADD-TODOLIST', title: title, todolistId: todolistId }
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
  return { type: 'CHANGE-TODOLIST-TITLE', id: id, title: title }
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
  return { type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter }
}
export const setTodolistsAC = (todoLists: TodolistType[]): SetTodoListsType => {
  return {
    type: 'SET-TODOS',
    todoLists,
  }
}

export const getTodolistsTC = () => (dispatch: Dispatch) => {
  const promise = todolistsAPI.getTodolists()
  promise.then((res) => {
    dispatch(setTodolistsAC(res.data))
  })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  const promise = todolistsAPI.deleteTodolist(todolistId)
  promise.then(() => {
    dispatch(removeTodolistAC(todolistId))
  })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  const promise = todolistsAPI.createTodolist(title)
  promise.then((res) => {
    dispatch(addTodolistAC(title, res.data.data.item.id))
  })
}
export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
  const promise = todolistsAPI.updateTodolist(id, title)
  promise.then(() => {
    dispatch(changeTodolistTitleAC(id, title))
  })
}
