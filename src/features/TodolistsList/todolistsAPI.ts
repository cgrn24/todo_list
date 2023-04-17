import { GetTasksResponse, ResponseType, TaskType, TodolistType, UpdateTaskModelType } from '../../common/types/types'
import { instance } from '../../common/api/commonAPI'

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>('todo-lists')
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', { title: title })
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${id}`, { title: title })
  },
  reorderTodolists(id: string, putAfterId: string | null) {
    return instance.put<ResponseType>(`todo-lists/${id}/reorder`, { putAfterId: putAfterId })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title: taskTitile })
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  reorderTask(todolistId: string, taskId: string, putAfterId: string | null) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}/reorder`, { putAfterId: putAfterId })
  },
}
