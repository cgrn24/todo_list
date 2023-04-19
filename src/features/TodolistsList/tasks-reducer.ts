import { todolistsAPI } from './todolistsAPI'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from '../../app/app-actions'
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from '../../common/utils/error-utils'
import { asyncActions as asyncTodolistsActions } from './todolists-reducer'
import { TaskType, ThunkError, UpdateTaskModelType } from '../../common/types/types'
import { ResultCode, TaskPriorities, TaskStatuses } from '../../common/enums/common-enums'
import { clearTasksAndTodolists } from 'common/actions/common-actions'
import { AppRootStateType } from 'app/store'
import { AxiosError } from 'axios'

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string, ThunkError>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: 'loading' }))
  try {
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(appActions.setAppStatus({ status: 'succeeded' }))
    return { tasks, todolistId }
  } catch (e) {
    const error = e as AxiosError
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})
export const removeTask = createAsyncThunk<{ taskId: string; todolistId: string }, { taskId: string; todolistId: string }, ThunkError>(
  'tasks/removeTask',
  async (param, thunkAPI) => {
    try {
      await todolistsAPI.deleteTask(param.todolistId, param.taskId)
      return { taskId: param.taskId, todolistId: param.todolistId }
    } catch (e) {
      const error = e as AxiosError
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
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
  } catch (e) {
    const error = e as AxiosError
    return handleAsyncServerNetworkError(error, thunkAPI, false)
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
    } catch (e) {
      const error = e as AxiosError
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
  }
)
export const reorderTask = createAsyncThunk(
  'tasks/reorderTask',
  async (param: { taskId: string; putAfterItemId: string | null; sourceId: number; destinationId: number; todolistId: string }, thunkAPI) => {
    try {
      thunkAPI.dispatch(reorderTaskAction({ sourceId: param.sourceId, destinationId: param.destinationId, todolistId: param.todolistId }))
      const res = await todolistsAPI.reorderTask(param.todolistId, param.taskId, param.putAfterItemId)
      if (res.data.resultCode === ResultCode.Success) {
        return null
      } else {
        thunkAPI.dispatch(reorderTaskAction({ sourceId: param.destinationId, destinationId: param.sourceId, todolistId: param.todolistId }))
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (e) {
      thunkAPI.dispatch(reorderTaskAction({ sourceId: param.destinationId, destinationId: param.sourceId, todolistId: param.todolistId }))
      const error = e as AxiosError
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
  }
)

export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask,
  reorderTask,
}

export const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reorderTaskAction(state, action: PayloadAction<{ sourceId: number; destinationId: number; todolistId: string }>) {
      const [task] = state[action.payload.todolistId].splice(action.payload.sourceId, 1)
      state[action.payload.todolistId].splice(action.payload.destinationId, 0, task)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodolistsActions.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(asyncTodolistsActions.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(asyncTodolistsActions.fetchTodolists.fulfilled, (state, action) => {
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

export const { reorderTaskAction } = slice.actions

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
