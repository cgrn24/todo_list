import { todolistsAPI, UpdateTodolistTitleArgType } from './todolists-api'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReorderTodolistType, TodolistType } from 'common/types/types'
import { clearTasksAndTodolists } from 'common/actions/common-actions'
import { ResultCode } from 'common/enums/common-enums'
import { createAppAsyncThunk } from 'common/utils/create-app-acyns-thunk'
import { RequestStatusType } from 'app/app-reducer'
import { AxiosError } from 'axios'

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>('todo/fetchTodolists', async () => {
  const res = await todolistsAPI.getTodolists()
  return { todolists: res.data }
})

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>('todo/addTodolist', async (title, { rejectWithValue }) => {
  const res = await todolistsAPI.createTodolist(title)
  if (res.data.resultCode === ResultCode.Success) {
    return { todolist: res.data.data.item }
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: false })
  }
})

const removeTodolist = createAppAsyncThunk<{ id: string }, string>('todo/removeTodolist', async (id, { dispatch, rejectWithValue }) => {
  dispatch(
    todolistsActions.changeTodolistEntityStatus({
      id,
      entityStatus: 'loading',
    })
  )
  const res = await todolistsAPI.deleteTodolist(id)
  if (res.data.resultCode === ResultCode.Success) {
    return { id }
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true })
  }
})

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
  'todo/changeTodolistTitle',
  async (arg, { rejectWithValue, dispatch }) => {
    dispatch(
      todolistsActions.changeTodolistEntityStatus({
        id: arg.id,
        entityStatus: 'loading',
      })
    )
    const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  }
)

const reorderTodolists = createAppAsyncThunk<ReorderTodolistType, ReorderTodolistType>('todo/reorderTodolists', async (arg, { rejectWithValue, dispatch }) => {
  dispatch(
    todolistsActions.changeTodolistEntityStatus({
      id: arg.id,
      entityStatus: 'loading',
    })
  )
  try {
    dispatch(todolistsActions.reorderTodolistAction({ sourceId: arg.sourceId, destinationId: arg.destinationId }))
    const res = await todolistsAPI.reorderTodolists(arg.id, arg.putAfterItemId)
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(
        todolistsActions.changeTodolistEntityStatus({
          id: arg.id,
          entityStatus: 'succeeded',
        })
      )
      return arg
    } else {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, entityStatus: 'failed' }))
      dispatch(todolistsActions.reorderTodolistAction({ sourceId: arg.destinationId, destinationId: arg.sourceId }))
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  } catch (e) {
    // debugger
    const error = e as AxiosError
    dispatch(todolistsActions.changeTodolistEntityStatus({ id: arg.id, entityStatus: 'failed' }))
    dispatch(todolistsActions.reorderTodolistAction({ sourceId: arg.destinationId, destinationId: arg.sourceId }))
    return rejectWithValue({ error: error.message, showGlobalError: true })
  }
})
// const reorderTodolists = createAsyncThunk(
//   'todolists/reorderTodolists',
//   async (param: { id: string; putAfterItemId: string | null; sourceId: number; destinationId: number }, thunkAPI) => {
//     try {
//       thunkAPI.dispatch(todolistsActions.reorderTodolistAction({ sourceId: param.sourceId, destinationId: param.destinationId }))
//       const res = await todolistsAPI.reorderTodolists(param.id, param.putAfterItemId)
//       if (res.data.resultCode === ResultCode.Success) {
//         return null
//       } else {
//         thunkAPI.dispatch(todolistsActions.reorderTodolistAction({ sourceId: param.destinationId, destinationId: param.sourceId }))
//         return null
//       }
//     } catch (e) {
//       thunkAPI.dispatch(todolistsActions.reorderTodolistAction({ sourceId: param.destinationId, destinationId: param.sourceId }))
//       const error = e as AxiosError
//       return null
//     }
//   }
// )

const initialState: TodolistDomainType[] = []

export const slice = createSlice({
  name: 'todo',
  initialState: initialState,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id)
      if (todo) {
        todo.filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id)
      if (todo) {
        todo.entityStatus = action.payload.entityStatus
      }
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

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
  reorderTodolists,
}

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
