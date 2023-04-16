import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from 'app/store'
import { AlertProps, Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import {appAction} from "app/app-reducer";
import {selectError} from "app/app.selector";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {

    const error = useSelector(selectError)
    const dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(appAction.setAppError({error:null}));
    }


    const isOpen = error !== null;

    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="error">
						{error}
					</Alert>
				</Snackbar>
    )
}
