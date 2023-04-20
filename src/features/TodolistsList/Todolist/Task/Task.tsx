import React, { ChangeEvent, useCallback } from 'react'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { TaskType } from 'common/types/types'
import { TaskStatuses } from 'common/enums/common-enums'
import { useActions } from 'common/hooks/useActions'
import { Checkbox, IconButton } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import style from './Task.module.css'
import { tasksActions } from 'features/TodolistsList'

type TaskPropsType = {
  task: TaskType
  todolistId: string
  isLoading: boolean
}

export const Task = React.memo((props: TaskPropsType) => {
  const { updateTask, removeTask } = useActions(tasksActions)

  const onClickHandler = useCallback(() => removeTask({ taskId: props.task.id, todolistId: props.todolistId }), [props.task.id, props.todolistId])

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTask({
        taskId: props.task.id,
        model: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
        todolistId: props.todolistId,
      })
    },
    [props.task.id, props.todolistId]
  )

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTask({
        taskId: props.task.id,
        model: { title: newValue },
        todolistId: props.todolistId,
      })
    },
    [props.task.id, props.todolistId]
  )

  return (
    <div key={props.task.id} className={style.taskContainer}>
      <Checkbox checked={props.task.status === TaskStatuses.Completed} color='secondary' onChange={onChangeHandler} disabled={props.isLoading} />
      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton size={'small'} onClick={onClickHandler} disabled={props.isLoading}>
        <RemoveCircleIcon fontSize={'small'} />
      </IconButton>
    </div>
  )
})
