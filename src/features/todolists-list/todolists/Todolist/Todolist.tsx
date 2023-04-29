import { FC, memo, useEffect } from 'react'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { TodolistDomainType, todolistsThunks } from '../todolists-reducer'
import { TaskType } from 'common/types/types'
import { useActions } from 'common/hooks/useActions'
import { IconButton, Paper } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import style from './Todolist.module.css'
import { tasksThunks } from 'features/todolists-list/tasks/tasks-reducer'
import { TodolistTitle } from './TodolistTitle/TodolistTitle'
import { FilterTasksButtons } from './FilterTasksButtons/FilterTasksButtons'
import { Tasks } from '../Tasks/Tasks'

type Props = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  draggable: DraggableProvidedDragHandleProps | null | undefined
}

export const Todolist: FC<Props> = memo(({ todolist, tasks, draggable }) => {
  const { fetchTasks, addTask } = useActions(tasksThunks)
  const { removeTodolist } = useActions(todolistsThunks)

  useEffect(() => {
    if (!tasks.length) {
      fetchTasks(todolist.id)
    }
  }, [])

  const addTaskCallback = (title: string) => {
    return addTask({ title, todolistId: todolist.id }).unwrap()
  }

  const removeTodolistHandler = () => {
    removeTodolist(todolist.id)
  }

  return (
    <Paper className={style.paper}>
      <IconButton
        size={'small'}
        onClick={removeTodolistHandler}
        disabled={todolist.entityStatus === 'loading'}
        className={style.deleteIcon}
        sx={{ position: 'absolute' }}
      >
        <ClearIcon fontSize={'small'} />
      </IconButton>
      <div {...draggable}>
        <TodolistTitle todolist={todolist} />
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'} />
      </div>
      <Tasks todolist={todolist} tasks={tasks} />
      <FilterTasksButtons todolist={todolist} />
    </Paper>
  )
})
