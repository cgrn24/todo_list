import { Button, Checkbox, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { ChangeEvent, memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AddItemForm } from './AddItemForm'
import { FilterValuesType } from './App'
import { EditableSpan } from './EditableSpan'
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './reducers/tasks-reducer'
import { ChangeTodoListFilterAC, ChangeTodoLisTitleAC, RemoveTodoListAC } from './reducers/todlist-reducer'
import { AppRootStateType } from './state/store'
import { Task } from './Task'

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

export type TodoListReduxPropsType = {
  todoListId: string
  title: string
  filter: FilterValuesType
}

export const TodoListRedux = memo(({ todoListId, title, filter }: TodoListReduxPropsType) => {
  console.log('Todolist Render')

  let tasks = useSelector<AppRootStateType, Array<TaskType>>((state) => state.tasks[todoListId])
  const dispatch = useDispatch()

  const removeTodolist = useCallback(() => {
    dispatch(RemoveTodoListAC(todoListId))
  }, [dispatch])

  const changeTodolistTitle = useCallback(
    (title: string) => {
      dispatch(ChangeTodoLisTitleAC(todoListId, title))
    },
    [dispatch]
  )

  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskAC(title, todoListId))
    },
    [dispatch]
  )
  const onAllClickHandler = useCallback(() => dispatch(ChangeTodoListFilterAC('all', todoListId)), [])
  const onActiveClickHandler = useCallback(() => dispatch(ChangeTodoListFilterAC('active', todoListId)), [])
  const onCompletedClickHandler = useCallback(() => dispatch(ChangeTodoListFilterAC('completed', todoListId)), [])

  if (filter === 'active') {
    tasks = tasks.filter((t) => !t.isDone)
  }
  if (filter === 'completed') {
    tasks = tasks.filter((t) => t.isDone)
  }

  return (
    <div>
      <h3>
        <EditableSpan title={title} changeTitle={changeTodolistTitle} />
        <IconButton onClick={removeTodolist}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} />
      <div>
        {tasks.map((t) => {
          return <Task />
          const onClickHandler = () => dispatch(removeTaskAC(t.id, todoListId))
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked
            dispatch(changeTaskStatusAC(t.id, newIsDoneValue, todoListId))
          }
          const onTitleChangeHandler = (newValue: string) => {
            dispatch(changeTaskTitleAC(t.id, newValue, todoListId))
          }
        })}
      </div>
      <div>
        <Button variant={filter === 'all' ? 'outlined' : 'text'} onClick={onAllClickHandler} color={'default'}>
          All
        </Button>
        <Button variant={filter === 'active' ? 'outlined' : 'text'} onClick={onActiveClickHandler} color={'primary'}>
          Active
        </Button>
        <Button variant={filter === 'completed' ? 'outlined' : 'text'} onClick={onCompletedClickHandler} color={'secondary'}>
          Completed
        </Button>
      </div>
    </div>
  )
})
