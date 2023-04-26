import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AddTaskArgType, RemoveTaskArgType, TaskType, UpdateTaskArgType, UpdateTaskModelType } from 'common/types/types'
import { ResultCode, TaskPriorities, TaskStatuses } from 'common/enums/common-enums'
import { clearTasksAndTodolists } from 'common/actions/common-actions'
import { tasksApi } from './tasks-api'
import { todolistsActions, todolistsThunks } from '../todolists/todolists-reducer'
import { createAppAsyncThunk } from 'common/utils/create-app-acyns-thunk'
import { appActions } from 'app/app-reducer'

const initialState: TasksStateType = {}

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>('tasks/fetchTasks', async (todolistId) => {
  const res = await tasksApi.getTasks(todolistId)
  const tasks = res.data.items
  return { tasks, todolistId }
})
export const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>('tasks/removeTask', async (arg, { rejectWithValue }) => {
  const res = await tasksApi.deleteTask(arg.todolistId, arg.taskId)
  if (res.data.resultCode === ResultCode.Success) {
    return arg
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true })
  }
})
export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>('tasks/addTask', async (arg, { rejectWithValue }) => {
  const res = await tasksApi.createTask(arg.todolistId, arg.title)
  if (res.data.resultCode === ResultCode.Success) {
    const task = res.data.data.item
    return { task }
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: false })
  }
})
const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTask', async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI

  const state = getState()
  const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
  if (!task) {
    dispatch(appActions.setAppError({ error: 'Task not found' }))
    return rejectWithValue(null)
  }

  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...arg.domainModel,
  }

  const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel)
  if (res.data.resultCode === ResultCode.Success) {
    return arg
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true })
  }
})
export const reorderTask = createAppAsyncThunk(
  'tasks/reorderTask',
  async (param: { taskId: string; putAfterItemId: string | null; sourceId: number; destinationId: number; todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(tasksActions.reorderTaskAction({ sourceId: param.sourceId, destinationId: param.destinationId, todolistId: param.todolistId }))
    thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({ id: param.todolistId, entityStatus: 'loading' }))
    const res = await tasksApi.reorderTask(param.todolistId, param.taskId, param.putAfterItemId)
    if (res.data.resultCode === ResultCode.Success) {
      thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({ id: param.todolistId, entityStatus: 'idle' }))
      return null
    } else {
      thunkAPI.dispatch(tasksActions.reorderTaskAction({ sourceId: param.destinationId, destinationId: param.sourceId, todolistId: param.todolistId }))
      thunkAPI.dispatch(todolistsActions.changeTodolistEntityStatus({ id: param.todolistId, entityStatus: 'idle' }))
    }
  }
)

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
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
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
        const tasks = state[action.payload.task.todoListId]
        tasks.unshift(action.payload.task)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel }
        }
      })
      .addCase(clearTasksAndTodolists, () => {
        return {}
      })
  },
})

export const tasksActions = slice.actions
export const tasksReducer = slice.reducer
export const tasksThunks = { fetchTasks, removeTask, addTask, updateTask, reorderTask }

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