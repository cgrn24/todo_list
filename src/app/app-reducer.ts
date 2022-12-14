import { createSlice, PayloadAction } from '@reduxjs/toolkit'
const initialState: InitialStateType = {
  isInitialized: false,
  status: 'idle',
  error: null,
}

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setInitializeAC: (state, action: PayloadAction<{ value: boolean }>) => {
      state.isInitialized = action.payload.value
    },
  },
})

export const appReducer = slice.reducer

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case 'APP/SET-STATUS':
//       return { ...state, status: action.status }
//     case 'APP/SET-ERROR':
//       return { ...state, error: action.error }
//     case 'APP/SET-INITIALIZED':
//       return { ...state, isInitialized: action.value }
//     default:
//       return { ...state }
//   }
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialized: boolean
}

// export const setAppErrorAC = (error: string | null) => ({ type: 'APP/SET-ERROR', error } as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status } as const)
// export const setInitializeAC = (value: boolean) => ({ type: 'APP/SET-INITIALIZED', value } as const)
export const { setAppErrorAC, setAppStatusAC, setInitializeAC } = slice.actions

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetInitializedActionType = ReturnType<typeof setInitializeAC>
