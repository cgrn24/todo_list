import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AddItemForm, AddItemFormSubmitHelperType } from '../../common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { selectIsLoggedIn } from '../Auth/selectors'
import { todolistsActions } from './index'
import { useActions } from '../../common/hooks/useActions'
import { useAppDispatch } from '../../common/hooks/useAppDispatch'
import { Grid } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { selectTasks, selectTodos } from './selectors'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

export const TodolistsList = () => {
  const todolists = useSelector(selectTodos)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const onDragEnd = (result: DropResult) => {
    debugger
    const { source, destination } = result
    if (!destination) return
    const sourceId = source.index
    const destinationId = destination.index
    const id = todolists[sourceId].id
    const putAfterId = destinationId !== 0 ? todolists[destinationId - 1].id : todolists[0].id

    reorderTodolistsTC({ id, putAfterId, sourceId, destinationId })
  }

  const dispatch = useAppDispatch()

  const { fetchTodolistsTC, addTodolistTC, reorderTodolistsTC } = useActions(todolistsActions)

  const addTodolistCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = addTodolistTC(title)
    const resultAction = await dispatch(thunk)

    if (todolistsActions.addTodolistTC.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0]
        helper.setError(errorMessage)
      } else {
        helper.setError('Some error occured')
      }
    } else {
      helper.setTitle('')
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    if (!todolists.length) {
      fetchTodolistsTC()
    }
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='todolists' direction='horizontal'>
          {(provided) => (
            <Grid container spacing={3} style={{ flexWrap: 'nowrap', overflowX: 'scroll' }} {...provided.droppableProps} ref={provided.innerRef}>
              {todolists.map((tl, index) => {
                let allTodolistTasks = tasks[tl.id]

                return (
                  <Draggable key={tl.id} draggableId={tl.id} index={index}>
                    {(provided) => (
                      <Grid item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div style={{ width: '290px' }}>
                          <Todolist todolist={tl} tasks={allTodolistTasks} />
                        </div>
                      </Grid>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}
