import { ResponseType, TodolistType } from 'common/types/types'
import { instance } from 'common/api/commonAPI'

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
  reorderTodolists(id: string, putAfterItemId: string | null) {
    return instance.put<ResponseType>(`todo-lists/${id}/reorder`, { putAfterItemId: putAfterItemId })
  },
}

export type UpdateTodolistTitleArgType = {
  id: string
  title: string
}
