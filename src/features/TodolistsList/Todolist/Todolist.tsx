import React, { FC, memo, useCallback, useEffect } from 'react'
import { AddItemForm } from '../../../components/AddItemForm/AddItemForm'
import { EditableSpan } from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Delete } from '@mui/icons-material';
import { Task } from './Task/Task'
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer'
import { useAppDispatch } from "../../../state/store";
import { fetchTasks } from './tasks.sagas';
import { TaskStatuses } from '../../../utils';
import { TaskType } from '../../../api/task-types';

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
}

export const Todolist: FC<Props> = memo(({ todolist, tasks, changeFilter, addTask, changeTaskStatus,
    changeTaskTitle, removeTask, removeTodolist, changeTodolistTitle }) => {
    console.log('Todolist called')

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTasks(todolist.id))
    }, [])

    const addTaskCallback = useCallback((title: string) => {
        addTask(title, todolist.id)
    }, [addTask, todolist.id])

    const removeTodolistCallback = useCallback(() => {
        removeTodolist(todolist.id)
    }, [todolist.id])

    const changeTodolistTitleCallback = useCallback((title: string) => {
        changeTodolistTitle(todolist.id, title)
    }, [todolist.id, changeTodolistTitle])

    const onAllClickHandler = useCallback(() => changeFilter('all', todolist.id), [todolist.id, changeFilter])
    const onActiveClickHandler = useCallback(() => changeFilter('active', todolist.id), [todolist.id, changeFilter])
    const onCompletedClickHandler = useCallback(() => changeFilter('completed', todolist.id), [todolist.id, changeFilter])

    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback} />
            <IconButton onClick={removeTodolistCallback} disabled={todolist.entityStatus === 'loading'}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'} />
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}
                    removeTask={removeTask}
                    changeTaskTitle={changeTaskTitle}
                    changeTaskStatus={changeTaskStatus}
                />)
            }
        </div>
        <div style={{ paddingTop: '10px' }}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                onClick={onAllClickHandler}
                color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                onClick={onActiveClickHandler}
                color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                onClick={onCompletedClickHandler}
                color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


