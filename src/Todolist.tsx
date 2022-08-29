import React, { useState, KeyboardEvent, ChangeEvent } from 'react'
import { FilterType } from './App'

type TaskType = {
  id: string
  title: string
  isDone: boolean
}

type PropsType = {
  title: string
  tasks: Array<TaskType>
  removeTask: (taskId: string) => void
  addTask: (inputValue: string) => void
}

export function Todolist(props: PropsType) {
  let [filterValue, setFilterValue] = useState('All')

  let filteredTasks = props.tasks
  if (filterValue === 'Active') {
    filteredTasks = props.tasks.filter((el) => !el.isDone)
  }
  if (filterValue === 'Completed') {
    filteredTasks = props.tasks.filter((el) => el.isDone)
  }

  const [inputValue, setInputValue] = useState('')

  const addTaskHandler = () => {
    props.addTask(inputValue)
    setInputValue('')
  }

  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTaskHandler()
    }
  }

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value)
  }

  const tsarChangeFilterHandler = (value: FilterType) => {
    setFilterValue(value)
  }

  const removeTaskHandler = (value: string) => {
    props.removeTask(value)
  }

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={inputValue}
          onKeyDown={onKeyPressHandler}
          onChange={onChangeHandler}
        />
        <button onClick={addTaskHandler}>+</button>
      </div>
      <ul>
        {filteredTasks.map((el) => {
          return (
            <li key={el.id}>
              <button onClick={() => removeTaskHandler(el.id)}>X</button>
              <input type='checkbox' checked={el.isDone} />
              <span>{el.title}</span>
            </li>
          )
        })}
      </ul>
      <div>
        <button onClick={() => tsarChangeFilterHandler('All')}>All</button>
        <button onClick={() => tsarChangeFilterHandler('Active')}>
          Active
        </button>
        <button onClick={() => tsarChangeFilterHandler('Completed')}>
          Completed
        </button>
      </div>
    </div>
  )
}
