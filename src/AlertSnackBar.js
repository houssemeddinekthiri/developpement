import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useEffect, useState } from 'react';

function Alert(props) {
    return <MuiAlert elevation={6}  variant="filled" {...props} />;
}
export default function AlertSnackBar(props) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(props.alert);
    }, [props.alert])
    return (
        <Snackbar open={open} autoHideDuration={10000} onClose={props.handleClose}>
            <Alert onClose={props.handleClose} severity={props.severity}>
                {props.text}
            </Alert>
        </Snackbar>
    )
}