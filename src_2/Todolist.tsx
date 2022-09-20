import React, { useState, KeyboardEvent, ChangeEvent } from 'react'
import { FilterType } from './App'
import styles from './Todolist.module.css'

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
  changeCheckboxStatus: (id: string, newIsDone: boolean) => void
}

export function Todolist(props: PropsType) {
  let [filterValue, setFilterValue] = useState('All')
  const [error, setError] = useState<string | null>(null)

  const [color, setColor] = useState<FilterType>('All')

  let filteredTasks = props.tasks
  if (filterValue === 'Active') {
    filteredTasks = props.tasks.filter((el) => !el.isDone)
  }
  if (filterValue === 'Completed') {
    filteredTasks = props.tasks.filter((el) => el.isDone)
  }

  const [inputValue, setInputValue] = useState('')

  const addTaskHandler = () => {
    if (inputValue.trim() !== '') {
      props.addTask(inputValue.trim())
      setInputValue('')
    } else setError('Title is required')
  }

  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTaskHandler()
    }
  }

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setInputValue(event.currentTarget.value)
  }

  const tsarChangeFilterHandler = (value: FilterType) => {
    setFilterValue(value)
    setColor(value)
  }

  const removeTaskHandler = (value: string) => {
    props.removeTask(value)
  }

  const changeCheckBoxStatusHandler = (tID: string, eventValue: boolean) => {
    props.changeCheckboxStatus(tID, eventValue)
  }

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={inputValue} onKeyDown={onKeyPressHandler} onChange={onChangeHandler} />
        <button onClick={addTaskHandler}>+</button>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <ul>
        {filteredTasks.map((el) => {
          // const changeCheckBoxStatusHandler = (event: ChangeEvent<HTMLInputElement>) => {
          //   props.changeCheckboxStatus(el.id, event.currentTarget.checked)
          // }
          return (
            <li key={el.id} className={el.isDone ? styles.isDone : ''}>
              <input
                type='checkbox'
                checked={el.isDone}
                onChange={(event: ChangeEvent<HTMLInputElement>) => changeCheckBoxStatusHandler(el.id, event.currentTarget.checked)}
                className={error ? styles.error : ''}
              />
              <span>{el.title}</span>
              <button onClick={() => removeTaskHandler(el.id)}>X</button>
            </li>
          )
        })}
      </ul>
      <div>
        <button onClick={() => tsarChangeFilterHandler('All')} className={color === 'All' ? styles.activeFilter : ''}>
          All
        </button>
        <button onClick={() => tsarChangeFilterHandler('Active')} className={color === 'Active' ? styles.activeFilter : ''}>
          Active
        </button>
        <button onClick={() => tsarChangeFilterHandler('Completed')} className={color === 'Completed' ? styles.activeFilter : ''}>
          Completed
        </button>
      </div>
    </div>
  )
}
