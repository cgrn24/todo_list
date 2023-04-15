import { AppDispatchType } from 'app/store'
import { useDispatch } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatchType>()
