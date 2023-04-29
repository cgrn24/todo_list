import { authAPI } from './auth-api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoginParamsType } from '../../common/types/types'
import { clearTasksAndTodolists } from 'common/actions/common-actions'
import { ResultCode } from 'common/enums/common-enums'
import { createAppAsyncThunk } from 'common/utils/create-app-acyns-thunk'
import { appActions } from 'app/app-reducer'

type AuthStateType = {
  isLoggedIn: boolean
  captcha: string | null
}

const initialState: AuthStateType = {
  isLoggedIn: false,
  captcha: null,
}

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (arg, { dispatch, rejectWithValue }) => {
  const res = await authAPI.login(arg)
  if (res.data.resultCode === ResultCode.Success) {
    return { isLoggedIn: true }
  }
  if (res.data.resultCode === ResultCode.Captcha) {
    dispatch(getCaptcha())
    return rejectWithValue({ data: res.data, showGlobalError: false })
  } else {
    const isShowAppError = !res.data.fieldsErrors?.length
    return rejectWithValue({ data: res.data, showGlobalError: isShowAppError })
  }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/logout', async (_, { dispatch, rejectWithValue }) => {
  const res = await authAPI.logout()
  if (res.data.resultCode === ResultCode.Success) {
    dispatch(clearTasksAndTodolists())
    return { isLoggedIn: false }
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true })
  }
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('app/initializeApp', async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false })
    }
  } finally {
    dispatch(appActions.setAppInitialized({ isInitialized: true }))
  }
})

const getCaptcha = createAppAsyncThunk('auth/getCaptcha', async (_, { dispatch, rejectWithValue }) => {
  const res = await authAPI.captcha()
  dispatch(authActions.setCaptcha({ captcha: res.data.url }))
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCaptcha: (state, action: PayloadAction<{ captcha: string }>) => {
      state.captcha = action.payload.captcha
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logout, initializeApp, getCaptcha }
