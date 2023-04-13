import { useDispatch } from 'react-redux'
import { AppDispatchType } from '../utils/types'

export const useAppDispatch = () => useDispatch<AppDispatchType>()
