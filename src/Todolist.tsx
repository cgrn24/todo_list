import React from 'react'
import { AddItemForm } from './AddItemForm'
import { FilterValuesType } from './App'
import { EditableSpan } from './EditableSpan'

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

type TodoListPropsType = {
  todoListId: string
  title: string
  tasks: Array<TaskType>
  filter: FilterValuesType
  removeTask: (taskID: string, todoListId: string) => void
  changeFilter: (filter: FilterValuesType, todoListId: string) => void
  addTask: (title: string, todoListId: string) => void
  changeStatus: (taskID: string, isDone: boolean, todoListId: string) => void
  removeTodoList: (todoListId: string) => void
  changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
  changeTodoListTitle: (title: string, todoListId: string) => void
}

const TodoList = (props: TodoListPropsType) => {
  let tasksItems: any = <span>Tasks list is empty</span>
  if (props.tasks.length) {
    tasksItems = props.tasks.map((task) => {
      const changeTaskTitle = (title: string) => {
        props.changeTaskTitle(task.id, title, props.todoListId)
      }
      return (
        <li key={task.id} className={task.isDone ? 'isDone' : ''}>
          <input onChange={(e) => props.changeStatus(task.id, e.currentTarget.checked, props.todoListId)} type='checkbox' checked={task.isDone} />
          {/* <span>{task.title}</span> */}
          <EditableSpan title={task.title} changeTitle={changeTaskTitle} />
          <button onClick={() => props.removeTask(task.id, props.todoListId)}>x</button>
        </li>
      )
    })
  }

  const addTask = (title: string) => {
    props.addTask(title, props.todoListId)
  }
  const changeTodoListTitle = (title: string) => {
    props.changeTodoListTitle(title, props.todoListId)
  }
  const handlerCreator = (filter: FilterValuesType, todoListId: string) => {
    return () => props.changeFilter(filter, todoListId)
  }

  return (
    <div>
      <h3>
        {/* {props.title} */}

        <EditableSpan title={props.title} changeTitle={changeTodoListTitle} />
        <button onClick={() => props.removeTodoList(props.todoListId)}>x</button>
      </h3>
      <AddItemForm addItem={addTask} />
      <ul>{tasksItems}</ul>
      <div>
        <button className={props.filter === 'all' ? 'btn-active btn' : 'btn'} onClick={() => props.changeFilter('all', props.todoListId)}>
          All
        </button>
        <button className={props.filter === 'active' ? 'btn-active btn' : 'btn'} onClick={handlerCreator('active', props.todoListId)}>
          Active
        </button>
        <button className={props.filter === 'completed' ? 'btn-active btn' : 'btn'} onClick={handlerCreator('completed', props.todoListId)}>
          Completed
        </button>
      </div>
    </div>
  )
}

export default TodoList
