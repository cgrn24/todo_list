import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AddItemForm, AddItemFormSubmitHelperType } from '../../common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { selectIsLoggedIn } from '../Auth/selectors'
import { todolistsActions } from './index'
import { useActions } from '../../common/hooks/useActions'
import { useAppDispatch } from '../../common/hooks/useAppDispatch'
import { Grid } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { selectTasks, selectTodos } from './selectors'

export const TodolistsList = () => {
  const todolists = useSelector(selectTodos)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  const { fetchTodolistsTC, addTodolistTC } = useActions(todolistsActions)

  const addTodolistCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = addTodolistTC(title)
    const resultAction = await dispatch(thunk)

    if (todolistsActions.addTodolistTC.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0]
        helper.setError(errorMessage)
      } else {
        helper.setError('Some error occured')
      }
    } else {
      helper.setTitle('')
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    if (!todolists.length) {
      fetchTodolistsTC()
    }
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>

      <Grid container spacing={3} style={{ maxWidth: '1280px' }}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <div style={{ width: '290px' }}>
                <Todolist todolist={tl} tasks={allTodolistTasks} />
              </div>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
