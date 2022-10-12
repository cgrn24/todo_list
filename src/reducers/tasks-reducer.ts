import { TasksStateType } from './../App'
import { v1 } from 'uuid'
import { AddTodoListAT, RemoveTodoListAT } from './todlist-reducer'

export type FirstTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

type ActionType = FirstTaskActionType | AddTaskActionType | ChangeTaskActionType | ChangeTaskTitleActionType | AddTodoListAT | RemoveTodoListAT

export const tasksReducer = (state: TasksStateType, action: ActionType): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter((t) => t.id !== action.taskId),
      }
    case 'ADD-TASK':
      return {
        ...state,
        [action.payload.todolistId]: [{ id: v1(), title: action.payload.title, isDone: false }, ...state[action.payload.todolistId]],
      }
    case 'CHANGE-TASK':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((el) =>
          el.id === action.payload.id ? { ...el, isDone: action.payload.isDone } : el
        ),
      }
    case 'CHANGE-TITLE':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((el) => (el.id === action.payload.id ? { ...el, title: action.payload.title } : el)),
      }
    case 'ADD-TODOLIST':
      return {
        ...state,
        [action.todolistId]: [],
      }
    case 'REMOVE-TODOLIST':
      // const {[action.todolistID]: [], ...rest} = {...state}
      // return rest
      let copyState = { ...state }
      delete copyState[action.todolistID]
      return copyState
    default:
      return state
  }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
  return { type: 'REMOVE-TASK', taskId, todolistId } as const
}
export const addTaskAC = (title: string, todolistId: string) => {
  return { type: 'ADD-TASK', payload: { title, todolistId } } as const
}
export const changeTaskStatusAC = (id: string, isDone: boolean, todolistId: string) => {
  return { type: 'CHANGE-TASK', payload: { id, isDone, todolistId } } as const
}
export const changeTaskTitleAC = (id: string, title: string, todolistId: string) => {
  return { type: 'CHANGE-TITLE', payload: { id, title, todolistId } } as const
}
