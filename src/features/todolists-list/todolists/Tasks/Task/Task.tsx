import React, { ChangeEvent, useCallback } from 'react'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { TaskType } from 'common/types/types'
import { TaskStatuses } from 'common/enums/common-enums'
import { useActions } from 'common/hooks/useActions'
import { Checkbox, IconButton } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import style from './Task.module.css'
import { tasksThunks } from 'features/todolists-list/tasks/tasks-reducer'

type TaskPropsType = {
  task: TaskType
  todolistId: string
  isLoading: boolean
}

export const Task = React.memo((props: TaskPropsType) => {
  const { updateTask, removeTask } = useActions(tasksThunks)

  const onClickHandler = useCallback(() => removeTask({ taskId: props.task.id, todolistId: props.todolistId }), [props.task.id, props.todolistId])

  const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({ taskId: props.task.id, domainModel: { status }, todolistId: props.todolistId })
  }

  const changeTitleHandler = (title: string) => {
    updateTask({ taskId: props.task.id, domainModel: { title }, todolistId: props.todolistId })
  }

  return (
    <div key={props.task.id} className={style.taskContainer}>
      <Checkbox checked={props.task.status === TaskStatuses.Completed} color='secondary' onChange={changeStatusHandler} disabled={props.isLoading} />
      <EditableSpan value={props.task.title} onChange={changeTitleHandler} />
      <IconButton size={'small'} onClick={onClickHandler} disabled={props.isLoading}>
        <RemoveCircleIcon fontSize={'small'} />
      </IconButton>
    </div>
  )
})
