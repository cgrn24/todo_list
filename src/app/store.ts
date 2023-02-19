import thunkMiddleware from 'redux-thunk'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

// непосредственно создаём store
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
})

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    store.replaceReducer(rootReducer)
  })
}
