import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { Todolist } from './todolists/Todolist/Todolist'
import { useActions } from 'common/hooks/useActions'
import { Grid } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { selectTodos } from './todolists/todolists-selectors'
import { selectTasks } from './tasks/tasks-selectors'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { mergeRefs } from 'react-merge-refs'
import { useHorizontalScroll } from 'common/hooks'
import { selectIsLoggedIn } from 'features/auth/auth-selectors'
import { todolistsThunks } from './todolists/todolists-reducer'

export const TodolistsList = () => {
  const todolists = useSelector(selectTodos)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const scrollRef = useHorizontalScroll(3)

  const { fetchTodolists, addTodolist, reorderTodolists } = useActions(todolistsThunks)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    const sourceId = source.index
    const destinationId = destination.index
    const id = todolists[sourceId].id
    const putAfterItemId = destinationId !== 0 ? todolists[destinationId - 1].id : ''
    reorderTodolists({ id, putAfterItemId, sourceId, destinationId })
  }
  const addTodolistCallback = (title: string) => {
    return addTodolist(title).unwrap()
  }

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    if (!todolists.length) {
      fetchTodolists(null)
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
            <Grid
              container
              spacing={3}
              style={{ flexWrap: 'nowrap', overflowX: 'scroll' }}
              {...provided.droppableProps}
              ref={mergeRefs([provided.innerRef, scrollRef])}
            >
              {todolists.map((tl, index) => {
                let allTodolistTasks = tasks[tl.id]

                return (
                  <Draggable key={tl.id} draggableId={tl.id} index={index}>
                    {(provided) => (
                      <Grid item ref={provided.innerRef} {...provided.draggableProps}>
                        <div style={{ width: '290px' }}>
                          <Todolist todolist={tl} tasks={allTodolistTasks} draggable={provided.dragHandleProps} />
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
