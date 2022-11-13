import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { IconButton, TextField } from '@material-ui/core'

type AddItemFormPropsType = {
  addItem: (title: string) => void
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {
  console.log('AddItemForm')
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
  // const userMessage = error ? <div style={{ color: 'hotpink' }}>Title is required!</div> : <div>Please, create list item's title</div>

  return (
    <div>
      <TextField
        variant='outlined'
        error={error}
        value={title}
        onChange={changeTitle}
        onKeyDown={onKeyDownAddTask}
        size={'small'}
        label={'Title'}
        helperText={error && 'Title is required!'}
      />
      {/* <input className={error ? 'error' : ''} value={title} onChange={changeTitle} onKeyDown={onKeyDownAddTask} /> */}
      <IconButton onClick={() => addItem(title)}>
        <AddCircleOutlineIcon />
      </IconButton>
      {/* {userMessage} */}
    </div>
  )
})
