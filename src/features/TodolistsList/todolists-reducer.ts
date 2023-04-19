import { AxiosError } from 'axios'
import { todolistsAPI } from './todolistsAPI'
import { RequestStatusType } from '../../app'
import { appActions } from '../../app/app-actions'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from '../../common/utils/error-utils'
import { ThunkError, TodolistType } from '../../common/types/types'
import { clearTasksAndTodolists } from 'common/actions/common-actions'
import { ResultCode } from 'common/enums/common-enums'

const { setAppStatus } = appActions

const fetchTodolists = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>('todolists/fetchTodolists', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await todolistsAPI.getTodolists()
    thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
    return { todolists: res.data }
  } catch (e) {
    const error = e as AxiosError
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})
const removeTodolist = createAsyncThunk<{ id: string }, string, ThunkError>('todolists/removeTodolist', async (todolistId, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    thunkAPI.dispatch(changeTodolistEntityStatus({ id: todolistId, status: 'loading' }))
    const res = await todolistsAPI.deleteTodolist(todolistId)
    if (res.data.resultCode === ResultCode.Success) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      return { id: todolistId }
    } else {
      thunkAPI.dispatch(changeTodolistEntityStatus({ id: todolistId, status: 'idle' }))
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (e) {
    thunkAPI.dispatch(changeTodolistEntityStatus({ id: todolistId, status: 'idle' }))
    const error = e as AxiosError
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})
const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>('todolists/addTodolist', async (title, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await todolistsAPI.createTodolist(title)
    if (res.data.resultCode === ResultCode.Success) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      return { todolist: res.data.data.item }
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (e) {
    const error = e as AxiosError
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})
const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle', async (param: { id: string; title: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await todolistsAPI.updateTodolist(param.id, param.title)
    if (res.data.resultCode === ResultCode.Success) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      return { id: param.id, title: param.title }
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (e) {
    const error = e as AxiosError
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})
const reorderTodolists = createAsyncThunk(
  'todolists/reorderTodolists',
  async (param: { id: string; putAfterItemId: string | null; sourceId: number; destinationId: number }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    try {
      thunkAPI.dispatch(reorderTodolistAction({ sourceId: param.sourceId, destinationId: param.destinationId }))
      const res = await todolistsAPI.reorderTodolists(param.id, param.putAfterItemId)
      if (res.data.resultCode === ResultCode.Success) {
        thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
        return null
      } else {
        thunkAPI.dispatch(reorderTodolistAction({ sourceId: param.destinationId, destinationId: param.sourceId }))
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (e) {
      thunkAPI.dispatch(reorderTodolistAction({ sourceId: param.destinationId, destinationId: param.sourceId }))
      const error = e as AxiosError
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
  }
)

export const asyncActions = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
  reorderTodolists,
}

export const slice = createSlice({
  name: 'todolists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string; status: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status
    },
    reorderTodolistAction(state, action: PayloadAction<{ sourceId: number; destinationId: number }>) {
      const [todo] = state.splice(action.payload.sourceId, 1)
      state.splice(action.payload.destinationId, 0, todo)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        state[index].title = action.payload.title
      })
      .addCase(clearTasksAndTodolists, () => {
        return []
      })
  },
})

export const { changeTodolistFilter, changeTodolistEntityStatus, reorderTodolistAction } = slice.actions

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
