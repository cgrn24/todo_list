import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { Dispatch } from 'redux'
import { authAPI, LoginParamsType, Result_code } from '../../api/todolists-api'
import { SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType, setInitializeAC, SetInitializedActionType } from '../../app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'

export const loginTC = createAsyncThunk('auth/login', async (param: LoginParamsType, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
  const res = await authAPI.login(param)
  try {
    if (res.data.resultCode === Result_code.OK) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
      return { isLoggedIn: true }
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch)
      return { isLoggedIn: false }
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI.dispatch)
    return { isLoggedIn: false }
  }
})

export const loginTC_ = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === Result_code.OK) {
        dispatch(setIsLoggedInAC({ value: true }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((rej) => {
      console.log(rej)
    })
}

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
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case 'login/SET-IS-LOGGED-IN':
//       return { ...state, isLoggedIn: action.value }
//     default:
//       return state
//   }
// }
// actions
// export const setIsLoggedInAC = (value: boolean) => ({ type: 'login/SET-IS-LOGGED-IN', value } as const)

// thunks

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === Result_code.OK) {
        dispatch(setIsLoggedInAC({ value: false }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((rej) => {
      console.log(rej)
    })
}
export const meTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: true }))
      dispatch(setAppStatusAC({ status: 'succeeded' }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    //@ts-ignore
    handleServerNetworkError(e, dispatch)
  } finally {
    dispatch(setInitializeAC({ value: true }))
  }
}

// types
// type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType | SetInitializedActionType
