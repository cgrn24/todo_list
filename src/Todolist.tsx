import React from 'react';
import { FilterType } from './App';


type TaskType = {
    id: number
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId:number)=>void
    filterTasks: (filterTasks:FilterType)=>void
}

// const [filterValue, setFilterValue] = useState('All')

//     let filterderTasks = tasks1
//     if (filterValue === 'Active') {
//         filterderTasks = tasks1.filter(el => !el.isDone)
//     }

//     if (filterValue === 'Completed') {
//         filterderTasks = tasks1.filter(el => el.isDone)
//     }

//     const filterTasks = (filterVal: FilterType) => {
//         setFilterValue(filterVal)
//     }
//перенести сюда

export function Todolist(props: PropsType) {
    return <div>
        <h3>{props.title}</h3>
        <div>
            <input/>
            <button>+</button>
        </div>
        <ul>
            {props.tasks.map((el, index)=>{
                return (
                    <li key={el.id}>
                        <button onClick={(event)=>props.removeTask(el.id)}>X</button>
                        <input type="checkbox" checked={el.isDone}/>
                        <span>{el.title}</span>
                    </li>
                )
            })}
        </ul>
        <div>
            <button onClick={()=>props.filterTasks('All')}>All</button>
            <button onClick={()=>props.filterTasks('Active')}>Active</button>
            <button onClick={()=>props.filterTasks('Completed')}>Completed</button>
        </div>
    </div>
}
