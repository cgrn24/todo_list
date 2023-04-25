import React, { FC } from 'react'
import { TaskStatuses } from 'common/enums'
import { TodolistDomainType } from '../todolists-reducer'
import { TaskType } from 'common/types/types'
import { Task } from './Task/Task'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { useActions } from 'common/hooks'
import { tasksThunks } from 'features/todolists-list/tasks/tasks-reducer'
import style from './Tasks.module.css'

type Props = {
  todolist: TodolistDomainType
  tasks: TaskType[]
}

export const Tasks: FC<Props> = ({ tasks, todolist }) => {
  const { reorderTask } = useActions(tasksThunks)
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    const sourceId = source.index
    const destinationId = destination.index
    const taskId = tasks[sourceId].id
    const putAfterItemId = destinationId !== 0 ? tasks[destinationId - 1].id : ''
    const todolistId = todolist.id
    reorderTask({ taskId, putAfterItemId, sourceId, destinationId, todolistId })
  }

  let tasksForTodolist = tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='tasks'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasksForTodolist.map((t, index) => (
                <Draggable key={t.id} draggableId={t.id} index={index} isDragDisabled={todolist.entityStatus === 'loading'}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Task key={t.id} task={t} todolistId={todolist.id} isLoading={todolist.entityStatus === 'loading'} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {!tasksForTodolist.length && <div className={style.noTask}>No task</div>}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}
