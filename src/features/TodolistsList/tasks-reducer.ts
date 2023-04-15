import { todolistsAPI } from './todolistsAPI'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { appActions } from '../../app/app-actions'
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from '../../common/utils/error-utils'
import { asyncActions as asyncTodolistsActions } from './todolists-reducer'
import { TaskType, ThunkError, UpdateTaskModelType } from '../../common/types/types'
import { ResultCode, TaskPriorities, TaskStatuses } from '../../common/enums/common-enums'
import { clearTasksAndTodolists } from 'common/actions/common-actions'
import { AppRootStateType } from 'app/store'

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string, ThunkError>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: 'loading' }))
  try {
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    return { tasks, todolistId }
  } catch (error) {
    //@ts-ignore
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})
export const removeTask = createAsyncThunk<{ taskId: string; todolistId: string }, { taskId: string; todolistId: string }, ThunkError>(
  'tasks/removeTask',
  async (param, thunkAPI) => {
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    return { taskId: param.taskId, todolistId: param.todolistId }
  }
)
export const addTask = createAsyncThunk<TaskType, { title: string; todolistId: string }, ThunkError>('tasks/addTask', async (param, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: 'loading' }))
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    if (res.data.resultCode === ResultCode.Success) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: 'succeeded' }))
      return res.data.data.item
    } else {
      handleAsyncServerAppError(res.data, thunkAPI, false)
      return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (err) {
    //@ts-ignore
    return handleAsyncServerNetworkError(err, thunkAPI, false)
  }
})
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (param: { taskId: string; model: UpdateDomainTaskModelType; todolistId: string }, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootStateType

    const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId)
    if (!task) {
      return thunkAPI.rejectWithValue('task not found in the state')
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
      if (res.data.resultCode === ResultCode.Success) {
        return param
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      //@ts-ignore
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
  }
)

export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask,
}

export const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodolistsActions.addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(asyncTodolistsActions.removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(asyncTodolistsActions.fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl: any) => {
          state[tl.id] = []
        })
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks.splice(index, 1)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model }
        }
      })
      .addCase(clearTasksAndTodolists, () => {
        return {}
      })
  },
})

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
