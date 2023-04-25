import { useEffect } from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import { ErrorSnackbar } from '../common/components/ErrorSnackbar/ErrorSnackbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CircularProgress, createTheme, ThemeProvider } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectAppStatus, selectIsInitialized } from './app-selectors'
import { useActions } from '../common/hooks/useActions'
import { NotFound } from 'common/components/NotFound/NotFound'
import { authThunks } from 'features/auth/auth-reducer'
import { selectIsLoggedIn } from 'features/auth/auth-selectors'
import { Login } from 'features/auth/Login/Login'
import { TodolistsList } from 'features/todolists-list/TodolistsList'

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
  const status = useSelector(selectAppStatus)
  const isInitialized = useSelector(selectIsInitialized)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const { logout, initializeApp } = useActions(authThunks)

  useEffect(() => {
    if (!isInitialized) {
      initializeApp(null)
    }
  }, [])

  const logoutHandler = () => logout(null)

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
          <Toolbar
            sx={{
              width: '100%',
              maxWidth: 1300,
              mx: 'auto',
            }}
          >
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
