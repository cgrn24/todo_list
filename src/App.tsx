import React, { useState } from 'react'
import { v1 } from 'uuid'
import './App.css'
import { Todolist } from './Todolist'

export type FilterType = 'All' | 'Active' | 'Completed'

function App() {
  let [tasks1, setTask1] = useState([
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: false },
    { id: v1(), title: 'ReactJS', isDone: true },
    { id: v1(), title: 'ReactJS2', isDone: false },
  ])

  const addTask = (inputValue: string) => {
    const newTask = { id: v1(), title: inputValue, isDone: false }
    setTask1([newTask, ...tasks1])
  }

  // const [filterValue, setFilterValue] = useState('All')

  // let filteredTasks = tasks1
  // if (filterValue === 'Active') {
  //   filteredTasks = tasks1.filter((el) => !el.isDone)
  // }
  // if (filterValue === 'Completed') {
  //   filteredTasks = tasks1.filter((el) => el.isDone)
  // }

  // const filterTasks = (filterVal: FilterType) => {
  //   setFilterValue(filterVal)
  // }

  const removeTask = (taskId: string) => {
    setTask1(tasks1.filter((el) => el.id !== taskId))
  }

  return (
    <div className='App'>
      <Todolist
        title='What to learn'
        tasks={tasks1}
        removeTask={removeTask}
        addTask={addTask}
      />
    </div>
  )
}

export default App
