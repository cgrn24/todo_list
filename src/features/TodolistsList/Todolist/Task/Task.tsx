import React, { ChangeEvent, useCallback } from 'react'
import { EditableSpan } from '../../../../common/components/EditableSpan/EditableSpan'
import { tasksActions } from '../../index'
import { TaskType } from '../../../../common/types/types'
import { TaskStatuses } from '../../../../common/enums/common-enums'
import { useActions } from '../../../../common/hooks/useActions'
import { Checkbox, IconButton } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

type TaskPropsType = {
  task: TaskType
  todolistId: string
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
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''} style={{ position: 'relative' }}>
      <Checkbox checked={props.task.status === TaskStatuses.Completed} color='secondary' onChange={onChangeHandler} />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton size={'small'} onClick={onClickHandler} style={{ position: 'absolute', top: '2px', right: '5px' }}>
        <RemoveCircleIcon fontSize={'small'} />
      </IconButton>
    </div>
  )
})
