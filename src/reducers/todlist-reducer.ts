import { v1 } from 'uuid'
import { FilterValuesType, TodoListType } from '../App'

type RemoveTodoListAT = {
  type: 'REMOVE-TODOLIST'
  todolistID: string
}
type AddTodoListAT = {
  type: 'ADD-TODOLIST'
  title: string
}
type ChangeTodoListFilter = {
  type: 'CHANGE-TODOLIST-FILTER'
  filter: FilterValuesType
  todoListId: string
}

type ChangeTodoListTitle = {
  type: 'CHANGE-TODOLIST-TITLE'
  title: string
  todoListId: string
}

type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListFilter | ChangeTodoListTitle

export const todolistsReducer = (todolists: Array<TodoListType>, action: ActionType): Array<TodoListType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return todolists.filter((tl) => tl.id !== action.todolistID)
    case 'ADD-TODOLIST':
      const newTodoListId: string = v1()
      return [...todolists, { id: newTodoListId, title: action.title, filter: 'all' }]
    case 'CHANGE-TODOLIST-FILTER':
      return todolists.map((tl) => (tl.id === action.todoListId ? { ...tl, filter: action.filter } : tl))
    case 'CHANGE-TODOLIST-TITLE':
      return todolists.map((tl) => (tl.id === action.todoListId ? { ...tl, title: action.title } : tl))

    default:
      return todolists
  }
}

export const RemoveTodoListAC = (id: string): RemoveTodoListAT => ({
  type: 'REMOVE-TODOLIST',
  todolistID: id,
})

export const AddTodoListAC = (title: string): AddTodoListAT => ({
  type: 'ADD-TODOLIST',
  title: title,
})
export const ChangeTodoListFilterAC = (filter: FilterValuesType, todoListId: string): ChangeTodoListFilter => ({
  type: 'CHANGE-TODOLIST-FILTER',
  filter: filter,
  todoListId: todoListId,
})
export const ChangeTodoLisTitleAC = (title: string, todoListId: string): ChangeTodoListTitle => ({
  type: 'CHANGE-TODOLIST-TITLE',
  title: title,
  todoListId: todoListId,
})
