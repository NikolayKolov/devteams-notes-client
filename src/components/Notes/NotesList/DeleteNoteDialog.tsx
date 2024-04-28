import { useContext, useState } from 'react';
import { AuthenticationContextWrapper } from '../../../contexts/authenticationContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GridActionsCellItem } from '@mui/x-data-grid/components';
import deleteNoteById from '../../../api/deleteNote';
import { FormStatus, FormStatusMessages } from '../../../lib/types';
import FormAlert from '../../RegistrationForm/FormAlert';
import { mutate } from 'swr';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DeleteNoteDialog = (props: any) => {
    const { deleteNoteId, ...rest} = props;
    const [open, setOpen] = useState(false);
    const [deleteErrors, setDeleteErrors] = useState({});
    const [status, setStatus] = useState<FormStatus>('idle');
    const deleteMessages: FormStatusMessages = {
        idle: 'Please confirm deletion',
        loading: 'Please wait...',
        success: 'Note deleted!',
        error: 'An error occured',
        errorNetwork: 'Please try again later'
    }
    const [auth, ] = useContext(AuthenticationContextWrapper);

    const handleDelete = async () => {
        setStatus('loading');
        setDeleteErrors({});
        try {
            const response = await deleteNoteById(deleteNoteId, auth?.jwt ?? '');
            const data = await response.json();
    
            if (response.ok) {
                setStatus('success');
                // revalidate stored data
                mutate('/notes/list'+auth?.user?.userId);
            } else {
                setStatus('error');
                setDeleteErrors(data);
            }
        } catch (e) {
            setStatus('errorNetwork');
        }
    }

    return (
        <>
            <GridActionsCellItem {...rest} onClick={() => setOpen(true)} />
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Delete this note?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <Box sx={{ p: 2 }}>
                    <FormAlert status={status} statusMessages={deleteMessages} />
                </Box>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleDelete}
                        color="warning"
                        autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeleteNoteDialog;