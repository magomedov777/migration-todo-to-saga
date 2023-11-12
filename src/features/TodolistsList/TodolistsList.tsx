import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/store'
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    TodolistDomainType
} from './todolists-reducer'
import { TasksStateType } from './tasks-reducer'
import { TaskStatuses } from '../../api/todolists-api'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { AddItemForm } from '../../components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { addTasks, removeTasks, updateTasks } from './Todolist/tasks.sagas'
import { fetchTodolists, removeTodolistWS } from './todolists.sagas'


export const TodolistsList: React.FC = () => {
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodolists())
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = removeTasks(id, todolistId)
        dispatch(thunk)
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        const thunk = addTasks(title, todolistId)
        dispatch(thunk)
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        const thunk = updateTasks(id, { status }, todolistId)
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback(function (id: string, title: string, todolistId: string) {
        dispatch(updateTasks(id, { title }, todolistId))
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value)
        dispatch(action)
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistWS(id))
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleTC(id, title)
        dispatch(thunk)
    }, [])

    const addTodolist = useCallback((title: string) => {
        const thunk = addTodolistTC(title)
        dispatch(thunk)
    }, [dispatch])


    return <>
        <Grid container style={{ padding: '20px' }}>
            <AddItemForm addItem={addTodolist} />
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
