import { Button, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()
  const returnToMain = () => navigate('/')
  return (
    <div>
      <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'} sx={{ paddingTop: '50px' }}>
        <Typography variant='h1'>Page not found</Typography>
        <Grid item sx={{ paddingTop: '20px' }}>
          <Button onClick={returnToMain} variant={'contained'}>
            Return to main page
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
