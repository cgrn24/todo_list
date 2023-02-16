import axios, { AxiosResponse } from 'axios'
import { GetTasksResponse, LoginParamsType, ResponseType, TaskType, TodolistType, UpdateTaskModelType, UserType } from './types'

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '6db0aff4-bda8-4df9-8071-4eea2acfbc33',
  },
})

// api
export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>('todo-lists')
  },
  createTodolist(title: string) {
    return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>('todo-lists', { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`todo-lists/${id}`, { title })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<{ userId: number }, AxiosResponse<ResponseType<{ item: TodolistType }>>>('auth/login', data)
  },
  me() {
    return instance.get<ResponseType<UserType>>('auth/me')
  },
  logout() {
    return instance.delete<ResponseType>('auth/login')
  },
}
