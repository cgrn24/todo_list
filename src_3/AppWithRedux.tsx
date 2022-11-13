import React, { useCallback, useReducer, useState } from 'react'
import './App.css'
import TodoList, { TaskType } from './TodoList'
import { v1 } from 'uuid'
import { AddItemForm } from './AddItemForm'
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import { AddTodoListAC, ChangeTodoListFilterAC, ChangeTodoLisTitleAC, RemoveTodoListAC, todolistsReducer } from './reducers/todlist-reducer'
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from './reducers/tasks-reducer'
import { useSelector } from 'react-redux'
import { AppRootStateType } from './state/store'
import { useDispatch } from 'react-redux'
import { TodoListRedux } from './TodoListRedux'
// CLI
// GUI => CRUD
// C+
// R+++....
// U++!
// D+

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListType = {
  id: string
  title: string
  filter: FilterValuesType
}
export type TasksStateType = {
  [todoListId: string]: Array<TaskType>
}

function AppWithRedux() {
  let todoLists = useSelector<AppRootStateType, Array<TodoListType>>((state) => state.todolists)

  const dispatch = useDispatch()

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(AddTodoListAC(title))
    },
    [dispatch]
  )

  const todoListsComponents = todoLists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper elevation={8} style={{ padding: '20px' }}>
          <TodoListRedux todoListId={tl.id} filter={tl.filter} title={tl.title} />
        </Paper>
      </Grid>
    )
  })

  return (
    <div className='App'>
      <AppBar position='static'>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton edge='start' color='inherit' aria-label='menu'>
            <Menu />
          </IconButton>
          <Typography variant='h6'>Todolists</Typography>
          <Button color='inherit' variant={'outlined'}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: '20px 0px' }}>
          <AddItemForm addItem={addTodoList} />
        </Grid>
        <Grid container spacing={5} justifyContent={'center'}>
          {todoListsComponents}
        </Grid>
      </Container>
    </div>
  )
}

export default AppWithRedux
