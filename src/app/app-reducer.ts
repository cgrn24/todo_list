import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authAPI } from '../api/todolists-api'
import { setIsLoggedInAC } from '../features/Login/auth-reducer'
import { handleServerAppError } from '../utils/error-utils'

export const meTC = createAsyncThunk('app/initializeApp', async (param, { dispatch }) => {
  const res = await authAPI.me()
  try {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: true }))
      dispatch(setAppStatusAC({ status: 'succeeded' }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    //@ts-ignore
    handleServerNetworkError(e, dispatch)
  }
})

const slice = createSlice({
  name: 'app',
  initialState: { isInitialized: false, status: 'idle', error: null } as InitialStateType,
  reducers: {
    setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder.addCase(meTC.fulfilled, (state, action) => {
      state.isInitialized = true
    })
  },
})

export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialized: boolean
}

export const { setAppErrorAC, setAppStatusAC } = slice.actions

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
