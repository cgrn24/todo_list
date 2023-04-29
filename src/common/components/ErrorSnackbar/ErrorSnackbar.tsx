import React, { SyntheticEvent } from 'react'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useSelector } from 'react-redux'
import { useActions } from '../../hooks/useActions'
import { AppRootStateType } from 'app/store'
import { appActions } from 'app/app-reducer'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorSnackbar = () => {
  const error = useSelector<AppRootStateType, string | null>((state) => state.app.error)
  const { setAppError } = useActions(appActions)

  const handleClose = (event: Event | SyntheticEvent<Element, Event>, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setAppError({ error: null })
  }
  const handleCloseAlert = (event: SyntheticEvent<Element, Event>, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setAppError({ error: null })
  }
  const isOpen = error !== null
  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleCloseAlert} severity='error' sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
