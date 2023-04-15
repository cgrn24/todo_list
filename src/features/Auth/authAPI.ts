import { LoginParamsType, ResponseType } from '../../common/types/types'
import { instance } from '../../common/api/commonAPI'

export const authAPI = {
  login(data: LoginParamsType) {
    const promise = instance.post<ResponseType<{ userId?: number }>>('auth/login', data)
    return promise
  },
  logout() {
    const promise = instance.delete<ResponseType<{ userId?: number }>>('auth/login')
    return promise
  },
  me() {
    const promise = instance.get<ResponseType<{ id: number; email: string; login: string }>>('auth/me')
    return promise
  },
}
