import React, { useCallback, useEffect } from 'react'
import { AddItemForm, AddItemFormSubmitHelperType } from '../../../common/components/AddItemForm/AddItemForm'
import { EditableSpan } from '../../../common/components/EditableSpan/EditableSpan'
import { Task } from './Task/Task'
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer'
import { tasksActions, todolistsActions } from '../index'
import { TaskType } from '../../../common/types/types'
import { TaskStatuses } from '../../../common/enums/common-enums'
import { useActions } from '../../../common/hooks/useActions'
import { useAppDispatch } from '../../../common/hooks/useAppDispatch'
import { Button, ButtonGroup, IconButton, Paper } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
}

export const Todolist = React.memo(function ({ ...props }: PropsType) {
  const { fetchTasks, reorderTask } = useActions(tasksActions)
  const { changeTodolistFilter, removeTodolist, changeTodolistTitle } = useActions(todolistsActions)

  const dispatch = useAppDispatch()

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    const sourceId = source.index
    const destinationId = destination.index
    const taskId = props.tasks[sourceId].id
    const putAfterId = destinationId !== 0 ? props.tasks[destinationId - 1].id : props.tasks[0].id
    const todolistId = props.todolist.id
    reorderTask({ taskId, putAfterId, sourceId, destinationId, todolistId })
  }

  useEffect(() => {
    if (!props.tasks.length) {
      fetchTasks(props.todolist.id)
    }
  }, [])

  const addTaskCallback = useCallback(
    async (title: string, helper: AddItemFormSubmitHelperType) => {
      let thunk = tasksActions.addTask({ title: title, todolistId: props.todolist.id })
      const resultAction = await dispatch(thunk)

      if (tasksActions.addTask.rejected.match(resultAction)) {
        if (resultAction.payload?.errors?.length) {
          const errorMessage = resultAction.payload?.errors[0]
          helper.setError(errorMessage)
        } else {
          helper.setError('Some error occured')
        }
      } else {
        helper.setTitle('')
      }
    },
    [props.todolist.id]
  )

  const removeTodolistHandler = () => {
    removeTodolist(props.todolist.id)
  }
  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title: title })
    },
    [props.todolist.id]
  )

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValuesType) =>
      changeTodolistFilter({
        filter: filter,
        id: props.todolist.id,
      }),
    [props.todolist.id]
  )

  let tasksForTodolist = props.tasks

  if (props.todolist.filter === 'active') {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (props.todolist.filter === 'completed') {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  const renderFilterButton = (buttonFilter: FilterValuesType, text: string) => {
    return (
      <Button color={props.todolist.filter === buttonFilter ? 'secondary' : 'primary'} onClick={() => onFilterButtonClickHandler(buttonFilter)}>
        {text}
      </Button>
    )
  }

  return (
    <Paper style={{ padding: '10px', position: 'relative' }}>
      <IconButton
        size={'small'}
        onClick={removeTodolistHandler}
        disabled={props.todolist.entityStatus === 'loading'}
        style={{ position: 'absolute', right: '5px', top: '5px' }}
      >
        <ClearIcon fontSize={'small'} />
      </IconButton>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='tasks'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasksForTodolist.map((t, index) => (
                <Draggable key={t.id} draggableId={t.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Task key={t.id} task={t} todolistId={props.todolist.id} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {!tasksForTodolist.length && <div style={{ padding: '10px', color: 'grey' }}>No task</div>}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div style={{ paddingTop: '10px' }}>
        <ButtonGroup variant='contained' aria-label='outlined primary button group'>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('active', 'Active')}
          {renderFilterButton('completed', 'Completed')}
        </ButtonGroup>
      </div>
    </Paper>
  )
})
