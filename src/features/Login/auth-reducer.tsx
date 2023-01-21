import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { authAPI, FieldErrorType, LoginParamsType, Result_code } from '../../api/todolists-api'
import { setAppStatusAC } from '../../app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'

export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> } }>(
  'auth/login',
  async (param: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
    const res = await authAPI.login(param)
    try {
      if (res.data.resultCode === Result_code.OK) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
        return
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
      }
    } catch (err) {
      const error = err as AxiosError
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
    }
  }
)

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
  const res = await authAPI.logout()
  try {
    if (res.data.resultCode === Result_code.OK) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
      return
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({})
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue({})
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false
    })
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions
