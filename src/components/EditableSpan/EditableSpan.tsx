import React, { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';

type Props = {
    value: string
    onChange: (newValue: string) => void
}

export const EditableSpan: FC<Props> = memo(({ value, onChange }) => {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(value);

    const activateEditMode = useCallback(() => {
        setEditMode(true);
        setTitle(value);
    }, [])
    const activateViewMode = useCallback(() => {
        setEditMode(false);
        onChange(title);
    }, [])
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
        : <span onDoubleClick={activateEditMode}>{value}</span>
});
