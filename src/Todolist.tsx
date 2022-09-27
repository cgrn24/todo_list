import { Button, ButtonGroup, Checkbox, IconButton, List, ListItem } from '@material-ui/core'
import { CheckBox } from '@material-ui/icons'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
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
        <ListItem style={{ padding: 0 }} key={task.id} className={task.isDone ? 'isDone' : ''}>
          <Checkbox
            onChange={(e) => props.changeStatus(task.id, e.currentTarget.checked, props.todoListId)}
            checked={task.isDone}
            style={{ color: 'hotpink' }}
          />
          {/* <input onChange={(e) => props.changeStatus(task.id, e.currentTarget.checked, props.todoListId)} type='checkbox' checked={task.isDone} /> */}
          {/* <span>{task.title}</span> */}
          <EditableSpan title={task.title} changeTitle={changeTaskTitle} />
          <IconButton aria-label='delete' onClick={() => props.removeTask(task.id, props.todoListId)} size='small'>
            <HighlightOffIcon />
          </IconButton>
        </ListItem>
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
        <IconButton aria-label='delete' onClick={() => props.removeTodoList(props.todoListId)} size='small'>
          <HighlightOffIcon />
        </IconButton>
        {/* <button onClick={() => props.removeTodoList(props.todoListId)}>x</button> */}
      </h3>
      <AddItemForm addItem={addTask} />
      <List>{tasksItems}</List>
      <div>
        {/* <Button
          size='small'
          variant='contained'
          disableElevation
          color={props.filter === 'all' ? 'secondary' : 'primary'}
          style={{ marginRight: '3px' }}
          onClick={() => props.changeFilter('all', props.todoListId)}
        >
          All
        </Button>
        <Button
          size='small'
          variant='contained'
          disableElevation
          color={props.filter === 'active' ? 'secondary' : 'primary'}
          style={{ marginRight: '3px' }}
          onClick={handlerCreator('active', props.todoListId)}
        >
          Active
        </Button>
        <Button
          size='small'
          variant='contained'
          disableElevation
          color={props.filter === 'completed' ? 'secondary' : 'primary'}
          style={{ marginRight: '3px' }}
          onClick={handlerCreator('completed', props.todoListId)}
        >
          Completed
        </Button> */}
        <ButtonGroup disableElevation size='small' variant='contained' color='primary' aria-label='contained primary button group'>
          <Button color={props.filter === 'all' ? 'secondary' : 'primary'} onClick={handlerCreator('all', props.todoListId)}>
            All
          </Button>
          <Button color={props.filter === 'active' ? 'secondary' : 'primary'} onClick={handlerCreator('active', props.todoListId)}>
            Active
          </Button>
          <Button color={props.filter === 'completed' ? 'secondary' : 'primary'} onClick={handlerCreator('completed', props.todoListId)}>
            Completed
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

export default TodoList
