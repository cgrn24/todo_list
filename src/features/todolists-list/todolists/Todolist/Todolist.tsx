import React, { FC, memo, useCallback, useEffect } from 'react'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { Task } from '../Tasks/Task/Task'
import { FilterValuesType, TodolistDomainType, todolistsThunks } from '../todolists-reducer'
import { TaskType } from 'common/types/types'
import { TaskStatuses } from 'common/enums/common-enums'
import { useActions } from 'common/hooks/useActions'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { Button, ButtonGroup, IconButton, Paper } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { DragDropContext, Draggable, DraggableProvidedDragHandleProps, Droppable, DropResult } from 'react-beautiful-dnd'
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
        style={{ position: 'absolute' }}
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
