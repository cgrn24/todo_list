import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addTodolistAC, AddTodolistActionType, removeTodolistAC, RemoveTodolistActionType, setTodolistsAC, SetTodolistsActionType } from './todolists-reducer'
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { AppRootStateType } from '../../app/store'
import { SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../../app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
  return todolistsAPI.getTasks(todolistId).then((res) => {
    const tasks = res.data.items
    // thunkAPI.dispatch(setTasksAC({ tasks, todolistId }))
    thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
    return { tasks, todolistId }
  })
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string; todolistId: string }, thunkAPI) => {
  const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
  return { taskId: param.taskId, todolistId: param.todolistId }
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string; todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
      return res.data.data.item
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue(null)
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue(null)
  }
})

export const updateTaskTC = createAsyncThunk(
  'tasks/updateTask',
  async (param: { taskId: string; model: UpdateDomainTaskModelType; todolistId: string }, { dispatch, rejectWithValue, getState }) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      return rejectWithValue('task not found in the state')
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...param.model,
    }

    const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
    try {
      if (res.data.resultCode === 0) {
        return param
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue('error')
      }
    } catch (error) {
      handleServerNetworkError(error as AxiosError, dispatch)
      return rejectWithValue('error')
    }
  }
)

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl: any) => {
        state[tl.id] = []
      })
    })
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    })
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload)
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    })
  },
})

export const tasksReducer = slice.reducer

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
