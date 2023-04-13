import { AppRootStateType } from '../../common/utils/types'

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
