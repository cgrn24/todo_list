import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '6db0aff4-bda8-4df9-8071-4eea2acfbc33',
  },
})
// const settings = {
//   withCredentials: true,
//   headers: {
//     'API-KEY': '6db0aff4-bda8-4df9-8071-4eea2acfbc33',
//   },
// }

export const todolistAPI = {
  getTodoLists() {
    const promise = instance.get<TodolistType[]>('todo-lists')
    return promise
  },
  createTodoList(title: string) {
    const promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', { title: title })
    return promise
  },
  deleteTodoList(todoListId: string) {
    const promise = instance.delete<ResponseType>(`todo-lists/${todoListId}`)
    return promise
  },
  updateTodoList(todoListId: string, title: string) {
    const promise = instance.put<ResponseType>(`todo-lists/${todoListId}`, { title: title })
    return promise
  },
  getTasks(todoListId: string) {
    const promise = instance.get(`todo-lists/${todoListId}/tasks`)
    return promise
  },
  createTask(todoListId: string, title: string) {
    const promise = instance.post(`todo-lists/${todoListId}/tasks`, { title: title })
    return promise
  },
  deleteTask(todoListId: string, taskId: string) {
    const promise = instance.post(`todo-lists/${todoListId}/tasks/${taskId}`)
    return promise
  },
  updateTask(todoListId: string, taskId: string, title: string, completed: boolean) {
    const promise = instance.post(`todo-lists/${todoListId}/tasks/${taskId}`, { title: title, completed: completed })
    return promise
  },
}

type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}

type ResponseType<T = {}> = {
  data: T
  fieldsErrors: string[]
  messages: string[]
  resultCode: number
}
