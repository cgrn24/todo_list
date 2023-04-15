import { AxiosError } from 'axios'
import { authAPI } from './authAPI'
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from '../../common/utils/error-utils'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FieldErrorType, LoginParamsType } from '../../common/types/types'
import { appActions } from '../../app/app-actions'
import { clearTasksAndTodolists } from 'common/actions/common-actions'
import { ResultCode } from 'common/enums/TaskStatuses'

const { setAppStatus } = appActions

export const login = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }>(
  'auth/login',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
    try {
      const res = await authAPI.login(param)
      if (res.data.resultCode === ResultCode.Success) {
        thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
        return
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (error) {
      //@ts-ignore
      return handleAsyncServerNetworkError(error, thunkAPI)
    }
  }
)
export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: 'loading' }))
  try {
    const res = await authAPI.logout()
    if (res.data.resultCode === ResultCode.Success) {
      thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }))
      thunkAPI.dispatch(clearTasksAndTodolists())
      return
    } else {
      return handleAsyncServerAppError(res.data, thunkAPI)
    }
  } catch (error) {
    //@ts-ignore
    return handleAsyncServerNetworkError(error, thunkAPI)
  }
})

export const asyncActions = {
  login,
  logout,
}

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedIn } = slice.actions
