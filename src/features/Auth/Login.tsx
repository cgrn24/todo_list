import { FormikHelpers, useFormik } from 'formik'
import { useSelector } from 'react-redux'
import { login } from './auth-reducer'
import { selectIsLoggedIn } from './selectors'
import { authActions } from './index'
import { useAppDispatch } from '../../common/hooks/useAppDispatch'
import { Navigate } from 'react-router-dom'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from '@mui/material'
import style from './Login.module.css'

type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useSelector(selectIsLoggedIn)

  const formik = useFormik({
    validate: (values) => {
      if (!values.email) {
        return {
          email: 'Email is required',
        }
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        return {
          email: 'Invalid email adress',
        }
      }
      if (!values.password) {
        return {
          password: 'Password is required',
        }
      }
    },
    initialValues: {
      email: 'free@samuraijs.com',
      password: 'free',
      rememberMe: false,
    },
    onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
      const resultAction = await dispatch(authActions.login(values))

      if (login.rejected.match(resultAction)) {
        if (resultAction.payload?.fieldsErrors?.length) {
          const error = resultAction.payload?.fieldsErrors[0]
          formikHelpers.setFieldError(error.field, error.error)
        }
      }
    },
  })

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{' '}
                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label='Email'
                margin='normal'
                helperText={formik.touched.email && formik.errors.email}
                error={formik.touched.email && !!formik.errors.email}
                {...formik.getFieldProps('email')}
              />
              <TextField
                type='password'
                label='Password'
                margin='normal'
                helperText={formik.touched.password && formik.errors.password}
                error={formik.touched.password && !!formik.errors.password}
                {...formik.getFieldProps('password')}
              />
              <FormControlLabel label={'Remember me'} control={<Checkbox {...formik.getFieldProps('rememberMe')} checked={formik.values.rememberMe} />} />
              <Button type={'submit'} variant={'contained'} color={'primary'}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
