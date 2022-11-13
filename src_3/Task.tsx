import React from 'react'
import { Checkbox, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { ChangeEvent, memo } from 'react'
import { useDispatch } from 'react-redux'
import { EditableSpan } from './EditableSpan'
import { changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './reducers/tasks-reducer'
import { TaskType } from './TodoListRedux'

export type TaskPropsType = {
  task: TaskType
  removeTask: (taskId: string) => void
  changeTaskStatus: (id: string, isDone: boolean) => void
  changeTaskTitle: (taskId: string, newTitle: string) => void
}

export const Task = memo(({ task, removeTask, changeTaskStatus, changeTaskTitle }: TaskPropsType) => {
  const dispatch = useDispatch()
  const onClickHandler = (todoListId: string) => dispatch(removeTaskAC(t.id, todoListId))
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked
    dispatch(changeTaskStatusAC(t.id, newIsDoneValue, todoListId))
  }
  const onTitleChangeHandler = (newValue: string) => {
    dispatch(changeTaskTitleAC(t.id, newValue, todoListId))
  }

  return (
    <div key={t.id} className={t.isDone ? 'is-done' : ''}>
      <Checkbox checked={t.isDone} color='primary' onChange={onChangeHandler} />

      <EditableSpan title={t.title} changeTitle={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  )
})
