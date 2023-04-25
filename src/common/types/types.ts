import { UpdateDomainTaskModelType } from 'features/todolists-list/tasks/tasks-reducer'
import { TaskStatuses, TaskPriorities } from '../enums/common-enums'

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type FieldErrorType = { field: string; error: string }
export type ResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  fieldsErrors?: Array<FieldErrorType>
  data: D
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type AddTaskArgType = {
  title: string
  todolistId: string
}

export type UpdateTaskArgType = {
  taskId: string
  domainModel: UpdateDomainTaskModelType
  todolistId: string
}

export type RemoveTaskArgType = {
  todolistId: string
  taskId: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
export type UserType = {
  id: string
  email: string
  login: string
}

export type ReorderTodolistType = {
  id: string
  putAfterItemId: string | null
  sourceId: number
  destinationId: number
}

export type ThunkError = { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }
