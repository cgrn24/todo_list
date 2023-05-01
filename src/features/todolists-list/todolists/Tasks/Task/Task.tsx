import { ChangeEvent, FC, memo } from 'react'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { TaskType } from 'common/types/types'
import { TaskStatuses } from 'common/enums/common-enums'
import { useActions } from 'common/hooks/useActions'
import { Checkbox, IconButton } from '@mui/material'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import style from './Task.module.css'
import { tasksThunks } from 'features/todolists-list/tasks/tasks-reducer'

type Props = {
  task: TaskType
  todolistId: string
  isLoading: boolean
}

export const Task: FC<Props> = memo(({ task, todolistId, isLoading }) => {
  const { updateTask, removeTask } = useActions(tasksThunks)

  const removeTaskHandler = () => removeTask({ taskId: task.id, todolistId: todolistId })

  const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({ taskId: task.id, domainModel: { status }, todolistId: todolistId })
  }

  const changeTitleHandler = (title: string) => {
    updateTask({ taskId: task.id, domainModel: { title }, todolistId: todolistId })
  }

  return (
    <div key={task.id} className={style.taskContainer}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color='secondary' onChange={changeStatusHandler} disabled={isLoading} />
      <EditableSpan value={task.title} onChange={changeTitleHandler} />
      <IconButton size={'small'} onClick={removeTaskHandler} disabled={isLoading}>
        <RemoveCircleIcon fontSize={'small'} />
      </IconButton>
    </div>
  )
})
