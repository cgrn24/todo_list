import React, { useState } from 'react'
import './App.css'
import { Todolist } from './Todolist'

export type FilterType = 'All' | 'Active' | 'Completed'

function App() {
  let [tasks1, setTask1] = useState([
    { id: 1, title: 'HTML&CSS', isDone: true },
    { id: 2, title: 'JS', isDone: false },
    { id: 3, title: 'ReactJS', isDone: true },
    { id: 4, title: 'ReactJS2', isDone: false },
  ])

  const [filterValue, setFilterValue] = useState('All')

  let filteredTasks = tasks1
  if (filterValue === 'Active') {
    return (filteredTasks = tasks1.filter((el) => !el.isDone))
  }
  if (filterValue === 'Completed') {
    return (filteredTasks = tasks1.filter((el) => el.isDone))
  }

  const removeTask = (taskId: number) => {
    setTask1(tasks1.filter((el) => el.id !== taskId))
  }

  const filterTasks = (filterVal: FilterType) => {
    setFilterValue(filterVal)
  }

  return (
    <div className='App'>
      <Todolist
        title='What to learn'
        tasks={filteredTasks}
        removeTask={removeTask}
        filterTasks={filterTasks}
      />
    </div>
  )
}

export default App
