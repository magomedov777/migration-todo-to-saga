import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../state/store'
import {
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistDomainType
} from './todolists-reducer'
import { TasksStateType } from './tasks-reducer';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { AddItemForm } from '../../components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { addTasks, removeTasks, updateTasks } from './Todolist/tasks.sagas'
import { addTodolistWS, changeTodolistTitleWS, fetchTodolists, removeTodolistWS } from './todolists.sagas'
import { TaskStatuses } from '../../utils';


export const TodolistsList: React.FC = () => {
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodolists())
    }, [])

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTasks(id, todolistId))
    }, [])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTasks(title, todolistId))
    }, [])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTasks(id, { status }, todolistId))
    }, [])

    const changeTaskTitle = useCallback((id: string, title: string, todolistId: string) => {
        dispatch(updateTasks(id, { title }, todolistId))
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [])

    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistWS(id))
    }, [])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistTitleWS(id, title))
    }, [])

    const addTodolistCallback = useCallback((title: string) => {
        dispatch(addTodolistWS(title))
    }, [dispatch])


    return <>
        <Grid container style={{ padding: '20px' }}>
            <AddItemForm addItem={addTodolistCallback} />
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{ padding: '10px' }}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
