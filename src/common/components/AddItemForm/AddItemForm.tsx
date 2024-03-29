import { ChangeEvent, FC, KeyboardEvent, memo, useState } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { RejectValueType } from 'common/utils/create-app-acyns-thunk'

type Props = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({ addItem, disabled = false }) => {
  let [title, setTitle] = useState('')
  let [error, setError] = useState<string | null>(null)

  const addItemHandler = async () => {
    if (title.trim() !== '') {
      addItem(title)
        .then(() => {
          setTitle('')
        })
        .catch((err: RejectValueType) => {
          if (err.data) {
            const messages = err.data.messages
            setError(messages.length ? messages[0] : 'Some error occurred')
          }
        })
    } else {
      setError('Title is required')
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.code === 'Enter') {
      addItemHandler()
    }
  }

  return (
    <div>
      <TextField
        variant='outlined'
        disabled={disabled}
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        label='Title'
        helperText={error}
      />
      <IconButton color='primary' onClick={addItemHandler} disabled={disabled} style={{ marginLeft: '7px', marginTop: '7px' }}>
        <AddCircleIcon />
      </IconButton>
    </div>
  )
})
