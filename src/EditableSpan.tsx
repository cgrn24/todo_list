import { TextField } from '@material-ui/core'
import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
type EditableSpanPropsType = {
  title: string
  changeTitle: (title: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.title)
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }
  const onEditMode = () => {
    setEditMode(true)
  }
  const offEditMode = () => {
    props.changeTitle(title)
    setEditMode(false)
  }
  const enterChangeTitle = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      offEditMode()
    }
  }
  return editMode ? (
    <TextField variant='standard' value={title} autoFocus onBlur={offEditMode} onChange={changeTitle} onKeyDown={enterChangeTitle} />
  ) : (
    // <input value={title} autoFocus onBlur={offEditMode} onChange={changeTitle} onKeyDown={enterChangeTitle} />
    <span onDoubleClick={onEditMode}>{props.title}</span>
  )
}
