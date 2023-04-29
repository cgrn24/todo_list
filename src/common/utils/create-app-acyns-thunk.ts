import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, AppRootStateType } from 'app/store'
import { AxiosError } from 'axios'
import { ResponseType } from 'common/types/types'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatch
  rejectValue: null | RejectValueType
}>()

export type RejectValueType = {
  data?: ResponseType
  error?: string
  showGlobalError: boolean
}
