import { useContext } from "react";
import { AuthenticationContextWrapper } from "../../../contexts/authenticationContext";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import NoteForm from "../NoteForm";
import getNoteById from "../../../api/getNoteById";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";

const NoteEditForm = () => {
    const { noteId } = useParams();
    const [auth,] = useContext(AuthenticationContextWrapper);
    const fetcher = () => getNoteById(noteId ?? '', auth?.jwt ?? '');
    const { data, error, isLoading } = useSWR('/api/note/'+noteId, fetcher);

    if (isLoading) return (
        <Paper elevation={3} sx={{m: 3, p: 2, maxWidth: 700 }}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '2.5rem' }} />
            <Skeleton animation="wave" variant="rectangular" height={250} />
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} />
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (data) return (<NoteForm noteToEdit={data} />);
}

export default NoteEditForm;