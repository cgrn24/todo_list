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
import { ErrorSnackbar } from '../common/components/ErrorSnackbar/ErrorSnackbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CircularProgress, createTheme, ThemeProvider } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectIsInitialized, selectStatus } from './selectors'
import { authActions, authSelectors, Login } from '../features/Auth'
import { useActions } from '../common/hooks/useActions'
import { appActions } from '.'
import { NotFound } from 'common/components/NotFound/NotFound'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#addae0',
    },
    secondary: {
      main: '#e0adda',
    },
  },
})

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
    <ThemeProvider theme={theme}>
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
        <Container fixed maxWidth={false} style={{ maxWidth: '1305px' }}>
          <Routes>
            <Route path={'/'} element={<TodolistsList />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/404'} element={<NotFound />} />
            <Route path='*' element={<Navigate to='/404' />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App
