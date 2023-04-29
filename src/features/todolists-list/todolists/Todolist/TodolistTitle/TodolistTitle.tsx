import { FC } from 'react'
import { useActions } from 'common/hooks'
import { EditableSpan } from 'common/components/EditableSpan/EditableSpan'
import { TodolistDomainType, todolistsThunks } from '../../todolists-reducer'

type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle: FC<Props> = ({ todolist }) => {
  const { changeTodolistTitle } = useActions(todolistsThunks)

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ id: todolist.id, title })
  }

  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
    </h3>
  )
}
