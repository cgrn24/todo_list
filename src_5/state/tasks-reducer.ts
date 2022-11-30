import { AppRootStateType } from './store'
import { todolistsAPI, UpdateTaskModelType } from './../api/todolists-api'
import { TasksStateType } from '../App'
import { v1 } from 'uuid'
import { AddTodolistActionType, RemoveTodolistActionType, SetTodoListsType } from './todolists-reducer'
import { TaskPriorities, TaskStatuses, TaskType, TodolistType } from '../api/todolists-api'
import { Dispatch } from 'redux'

export type RemoveTaskActionType = {
  type: 'REMOVE-TASK'
  todolistId: string
  taskId: string
}

export type AddTaskActionType = {
  type: 'ADD-TASK'
  task: TaskType
}

export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS'
  todolistId: string
  taskId: string
  status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE'
  todolistId: string
  taskId: string
  title: string
}

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodoListsType
  | ReturnType<typeof setTasksAC>

const initialState: TasksStateType = {
  /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      const stateCopy = { ...state }
      console.log(stateCopy)
      console.log(action.taskId, action.todolistId)

      const tasks = stateCopy[action.todolistId]
      const newTasks = tasks.filter((t) => t.id !== action.taskId)
      stateCopy[action.todolistId] = newTasks
      return stateCopy
    }
    case 'ADD-TASK': {
      //   const stateCopy = { ...state }
      //   const newTask: TaskType = {
      //     id: v1(),
      //     title: action.title,
      //     status: TaskStatuses.New,
      //     todoListId: action.todolistId,
      //     description: '',
      //     startDate: '',
      //     deadline: '',
      //     addedDate: '',
      //     order: 0,
      //     priority: TaskPriorities.Low,
      //   }
      //   const tasks = stateCopy[action.todolistId]
      //   const newTasks = [newTask, ...tasks]
      //   stateCopy[action.todolistId] = newTasks
      //   return stateCopy
      return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] }
    }
    case 'CHANGE-TASK-STATUS': {
      let todolistTasks = state[action.todolistId]
      let newTasksArray = todolistTasks.map((t) => (t.id === action.taskId ? { ...t, status: action.status } : t))

      state[action.todolistId] = newTasksArray
      return { ...state }
    }
    case 'CHANGE-TASK-TITLE': {
      let todolistTasks = state[action.todolistId]
      // найдём нужную таску:
      let newTasksArray = todolistTasks.map((t) => (t.id === action.taskId ? { ...t, title: action.title } : t))

      state[action.todolistId] = newTasksArray
      return { ...state }
    }
    case 'ADD-TODOLIST': {
      return {
        ...state,
        [action.todolistId]: [],
      }
    }
    case 'REMOVE-TODOLIST': {
      const copyState = { ...state }
      delete copyState[action.id]
      return copyState
    }
    case 'SET-TODOS': {
      let copyState = { ...state }
      action.todoLists.forEach((tl: TodolistType) => {
        copyState[tl.id] = []
      })
      return copyState
    }
    case 'SET-TASKS': {
      return {
        ...state,
        [action.todolistId]: action.tasks,
      }
    }
    default:
      return state
  }
}

export const removeTaskAC = (todolistId: string, taskId: string): RemoveTaskActionType => {
  return { type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId }
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
  return { type: 'ADD-TASK', task }
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
  return { type: 'CHANGE-TASK-STATUS', status, todolistId, taskId }
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
  return { type: 'CHANGE-TASK-TITLE', title, todolistId, taskId }
}

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
  return { type: 'SET-TASKS', tasks, todolistId } as const
}

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistsAPI.getTasks(todolistId).then((res) => {
    dispatch(setTasksAC(res.data.items, todolistId))
  })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  todolistsAPI
    .deleteTask(todolistId, taskId)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTaskAC(todolistId, taskId))
      }
    })
    .catch((e) => {
      console.log(e.message)
    })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistsAPI.createTask(todolistId, title).then((res) => {
    dispatch(addTaskAC(res.data.data.item))
  })
}

export const updateTaskTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const task = getState().tasks[todolistId].find((t) => t.id === taskId)
  if (task) {
    const model: UpdateTaskModelType = {
      ...task,
      status,
    }
    todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
      dispatch(changeTaskStatusAC(taskId, res.data.data.item.status, todolistId))
    })
  }

  //todolistsAPI.updateTask()
}

export const changeTaskTitleTC = (id: string, title: string, todolistId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const task = getState().tasks[todolistId].find((t) => t.id === id)
  if (task) {
    const model: UpdateTaskModelType = {
      ...task,
      title,
    }
    todolistsAPI.updateTask(todolistId, id, model).then((res) => {
      dispatch(changeTaskTitleAC(id, res.data.data.item.title, todolistId))
    })
  }
}
