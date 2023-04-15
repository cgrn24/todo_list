import { AppRootStateType } from 'app/store'

export const selectTasks = (state: AppRootStateType) => state.tasks
export const selectTodos = (state: AppRootStateType) => state.todolists
