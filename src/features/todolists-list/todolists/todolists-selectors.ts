import { AppRootStateType } from 'app/store'

export const selectTodos = (state: AppRootStateType) => state.todolists
