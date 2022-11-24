import React, { useEffect, useState } from 'react'
import { todolistAPI } from '../api/todolist-api'

export default {
  title: 'API',
}

// const settings = {
//   withCredentials: true,
//   headers: {
//     'API-KEY': '6db0aff4-bda8-4df9-8071-4eea2acfbc33',
//   },
// }

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const promise = todolistAPI.getTodoLists()
    promise.then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const data = 'LESSON-13_3'
    todolistAPI.createTodoList(data).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todoId = '9e051234-3325-4f8a-8a9c-e893311a43cb'
    todolistAPI.deleteTodoList(todoId).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todoId = '9e051234-3325-4f8a-8a9c-e893311a43cb'
    const data = 'LESSONNNNNNNNNNN'
    todolistAPI.updateTodoList(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todoId}`, data).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = '7c2156ca-2346-40ec-bf87-64a6498c3998'
    const promise = todolistAPI.getTasks(todolistId)
    promise.then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = '7c2156ca-2346-40ec-bf87-64a6498c3998'
    const title = 'chips'
    todolistAPI.createTask(todolistId, title).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todoId = 'f7c9288a-a66d-4cbd-b6a5-98ba0f556ff9'
    const taskId = ''
    todolistAPI.deleteTask(todoId, taskId).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todoId = 'f7c9288a-a66d-4cbd-b6a5-98ba0f556ff9'
    const taskId = ''
    const title = ''
    const completed = false
    todolistAPI.updateTask(todoId, taskId, title, completed).then((res) => {
      setState(res.data)
    })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
