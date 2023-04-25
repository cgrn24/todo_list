import React, { FC, useCallback } from 'react'
import { Button, ButtonGroup } from '@mui/material'
import { useActions } from 'common/hooks'
import { FilterValuesType, TodolistDomainType, todolistsActions } from '../../todolists-reducer'
import style from './FilterTasksButtons.module.css'

type Props = {
  todolist: TodolistDomainType
}

export const FilterTasksButtons: FC<Props> = ({ todolist }) => {
  const { changeTodolistFilter } = useActions(todolistsActions)

  const changeFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ filter, id: todolist.id })
  }

  return (
    <div className={style.buttonGroup}>
      <ButtonGroup variant='contained' aria-label='outlined primary button group'>
        <Button color={todolist.filter === 'active' ? 'secondary' : 'primary'} onClick={() => changeFilterHandler('all')}>
          All
        </Button>
        <Button color={todolist.filter === 'active' ? 'secondary' : 'primary'} onClick={() => changeFilterHandler('active')}>
          Active
        </Button>
        <Button color={todolist.filter === 'active' ? 'secondary' : 'primary'} onClick={() => changeFilterHandler('completed')}>
          Completed
        </Button>
      </ButtonGroup>
    </div>
  )
}
