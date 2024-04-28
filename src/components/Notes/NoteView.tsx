import { useContext, useState } from "react";
import { AuthenticationContextWrapper } from "../../contexts/authenticationContext";
import useSWR, { mutate } from "swr";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useParams } from "react-router-dom";
import editNote from "../../api/editNote";
import getNoteById from "../../api/getNoteById";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FormStatus } from "../../lib/types";
import FormAlert from "../RegistrationForm/FormAlert";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fetcher = () => any;

const NoteView = () => {
    const { noteId } = useParams();
    const [auth, ] = useContext(AuthenticationContextWrapper);
    const fetcher: Fetcher = () => getNoteById(noteId ?? '', auth?.jwt ?? '');
    const { data, error, isLoading, isValidating } = useSWR('/api/note/'+noteId, fetcher);
    const [status, setStatus] = useState<FormStatus>('idle');

    const statusMessages = {
        idle: 'You can edit checklist is task complete',
        loading: 'Please wait, updating...',
        success: 'Update successfull',
        error: 'An error occured',
        errorNetwork: 'Network error, please try again later'
    }

    const handleNoteUpdate = async (e: React.SyntheticEvent<HTMLInputElement>) => {
        setStatus('loading');
        const target = e.target as HTMLInputElement;
        const order = Number(target.id.split('_')[1]);
        const newArray = data.listItems.map(item => {
            if (order === item.order) {
                return {
                    order: item.order,
                    text: item.text,
                    isDone: !item.isDone
                }
            } else {
                return {
                    order: item.order,
                    text: item.text,
                    isDone: item.isDone
                }
            }
        });

        const newNote = {
            ...data,
            checkList: newArray,
            userId: Number(auth?.user?.userId)
        };

        try {
            const response = await editNote({...newNote}, auth!.jwt as string);
            const data = await response.json();
            
            if (!response.ok) {
                setStatus('error');
            } else {
                setStatus('success');
                mutate('/api/note/'+noteId);
            }
        } catch(e) {
            setStatus('errorNetwork');
        }
    }

    if (isLoading) return (
        <Paper elevation={3} sx={{m: 3, p: 2, maxWidth: 700 }}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '2.5rem' }} />
            <Skeleton animation="wave" variant="rectangular" height={250} />
            <Skeleton animation="wave" variant="rectangular" height={150} />
        </Paper>
    );

    if (error) {
        try {
            const errorToShow = JSON.parse(error.message);
            return (
                <Paper elevation={3} sx={{m: 3, p: 2 }}>
                    <Alert severity="error">{errorToShow.message ? errorToShow.message : 'An error has occured'}</Alert>
                </Paper>
            );
        } catch {
            return (
                <Paper elevation={3} sx={{m: 3, p: 2 }}>
                    <Alert severity="error">{error.message ? error.message : 'An error has occured'}</Alert>
                </Paper>
            );
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                px: 2,
                mt: {
                    xs: 2,
                    md: 8
                },
                width: {
                    xs: '100%',
                    md: '700px'
                }
            }}>
                <Paper elevation={3}>
                    <Typography variant="h5" gutterBottom={!!data.content} sx={
                        data.content ? 
                            { borderBottom: 1, borderColor: 'lightgray', py: 1, px: 2 } :
                            { py: 1, px: 2 }}>
                        {data.title}
                    </Typography>
                    {
                        data.content ? 
                            <Typography variant="subtitle1" gutterBottom sx={{py: 1, px: 2}}>
                                {data.content}
                            </Typography> :
                            null
                    }
                </Paper>
                {
                        data.listItems && data.listItems?.length ? 
                            <>
                                <Paper elevation={3}>
                                    <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'lightgray', py: 1, px: 2 }}>
                                        Check list Items
                                    </Typography>
                                    <List>
                                        {
                                            data.listItems.map(item => (
                                                <ListItem key={item.order}>
                                                    <ListItemText sx={item.isDone ? {
                                                        textDecoration: 'line-through',
                                                        color: 'text.disabled'
                                                    } : {}}>
                                                        {item.text}
                                                    </ListItemText>
                                                    <FormControlLabel control={
                                                        <Checkbox
                                                            name="isComplete"
                                                            disabled={status === 'loading'}
                                                            checked={item.isDone}
                                                            id={'item-isDone_'+item.order}
                                                            onChange={handleNoteUpdate} />}
                                                            label="Is task complete?" />
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Paper>
                                <FormAlert status={status} statusMessages={statusMessages} />
                            </> :
                            null
                    }
            </Box>
    );
}

export default NoteView;