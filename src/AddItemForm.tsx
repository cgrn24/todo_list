import React, { ChangeEvent, KeyboardEvent, useState } from 'react'

type AddItemFormPropsType = {
  addItem: (title: string) => void
}

export const AddItemForm = (props: AddItemFormPropsType) => {
  const [title, setTitle] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(false)
    setTitle(e.currentTarget.value)
  }
  const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addItem(title)
  }
  const addItem = (title: string) => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      props.addItem(trimmedTitle)
    } else {
      setError(true)
    }

    setTitle('')
  }
  const userMessage = error ? <div style={{ color: 'hotpink' }}>Title is required!</div> : <div>Please, create list item's title</div>

  return (
    <div>
      <input className={error ? 'error' : ''} value={title} onChange={changeTitle} onKeyDown={onKeyDownAddTask} />
      <button onClick={() => addItem(title)}>+</button>
      {userMessage}
    </div>
  )
}
