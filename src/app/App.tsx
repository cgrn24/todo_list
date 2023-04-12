import { useCallback, useEffect } from 'react'
import './App.css'
import { TodolistsList } from '../features/TodolistsList'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import { Menu } from '@mui/icons-material'
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnackbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectIsInitialized, selectStatus } from '../features/Application/selectors'
import { authActions, authSelectors, Login } from '../features/Auth'
import { useActions } from '../utils/redux-utils'
import { appActions } from '../features/Application'

const App = () => {
  const status = useSelector(selectStatus)
  const isInitialized = useSelector(selectIsInitialized)
  const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)

  const { logout } = useActions(authActions)
  const { initializeApp } = useActions(appActions)

  useEffect(() => {
    if (!isInitialized) {
      initializeApp()
    }
  }, [])

  const logoutHandler = useCallback(() => {
    logout()
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className='App'>
      <ErrorSnackbar />
      <AppBar position='static'>
        <Toolbar>
          <IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }}>
            <Menu />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Task manager
          </Typography>
          {isLoggedIn && (
            <Button color='inherit' onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={'/'} element={<TodolistsList />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path='*' element={<Navigate to='/404' />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
