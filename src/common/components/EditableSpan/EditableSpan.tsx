import { ChangeEvent, FC, memo, useState } from 'react'
import TextField from '@mui/material/TextField'
import style from './EditableSpan.module.css'

type Props = {
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan: FC<Props> = memo(({ value, onChange }) => {
  let [editMode, setEditMode] = useState(false)
  let [title, setTitle] = useState(value)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(value)
  }
  const activateViewMode = () => {
    setEditMode(false)
    onChange(title)
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode ? (
    <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
  ) : (
    <div onDoubleClick={activateEditMode} className={style.disabled}>
      {value}
    </div>
  )
})
