/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { AuthenticationContextWrapper } from "../../contexts/authenticationContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button  from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormStatus } from "../../lib/types";
import { CreateNote, CreateNoteType, CreateNoteListItemType } from "../../validators/noteValidator";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormAlert from "../RegistrationForm/FormAlert";
import Alert from "@mui/material/Alert";
import createNote from "../../api/createNote";
import editNote from "../../api/editNote";

type NoteFormProps = {
    noteToEdit?: CreateNoteType & { id: number }
}

const NoteForm = (props: NoteFormProps) => {
    const { noteToEdit } = props;
    const [auth, ] = useContext(AuthenticationContextWrapper);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formErrors, setFormErrors] = useState<any>({});
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');
    const [noteType, setNoteType] = React.useState<'TEXT' | 'CHECKLIST'>(
        noteToEdit?.type ?
            noteToEdit.type : 
            'TEXT');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [listItems, setListItems] = React.useState<Array<CreateNoteListItemType>>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        noteToEdit?.type === 'CHECKLIST' ? [...noteToEdit.listItems] : []);
    const [open, setOpen] = React.useState(false);
    
    const handleClose = () => { setOpen(false) };
    const handleOpen = () => { setOpen(true) };

    const statusMessages = {
        idle: 'Please enter note data',
        loading: 'Please wait, creation pending...',
        success: 'Creation successfull',
        error: 'Please fix form errors',
        errorNetwork: 'Network error, please try again later'
    }
    
    const handleSubmitItem = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const formData = e.target as HTMLFormElement;
        const text = formData.text.value;
        const isDone = formData.isDone.checked;
        const newCheckListItem = {
            text,
            isDone,
            order: 0
        };

        const array = [...listItems];
        let maxOrder = { order: 0 };
        if (array.length) maxOrder = array.reduce((prev, curr) => { return prev.order > curr.order ? prev : curr})
        newCheckListItem.order = maxOrder.order + 1;
        setListItems([...array, newCheckListItem]);

        handleClose();
    }

    const handleNoteTypeChange = (_e: React.MouseEvent<HTMLElement>, newType: 'TEXT' | 'CHECKLIST') => {
        setNoteType(newType);
    }

    const handleAddListItem = () => {
        handleOpen();
    }

    const handleDeleteItem = (order: number) => {
        const filteredArray = [...listItems].filter((item) => (item.order !== order));
        setListItems([...filteredArray]);
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setFormStatus('loading');
        setFormErrors({});
        const formData = e.target as HTMLFormElement;
        const title = formData.noteTitle.value;
        const content = formData.content.value;
        const type = noteType;
        const userId = auth?.user?.userId as string;
        let newNote: CreateNoteType;
        
        if (type === 'CHECKLIST') {
            newNote = {
                userId: Number(userId),
                title,
                content,
                type: 'CHECKLIST',
                // TypeScript sux
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                checkList: listItems
            };
        } else {
            newNote = {
                userId: Number(userId),
                title,
                content,
                type,
            }
        }
        const verify = CreateNote.safeParse(newNote);

        if (!verify.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorsObject: any = {}
            verify.error.issues.forEach((error) => {
                const errorKey = error.path[0];
                errorsObject[errorKey] = error.message;
            });
            setFormErrors(errorsObject);
            setFormStatus('error');
            return;
        }

        try {
            let response;
            if (noteToEdit === undefined) response = await createNote(newNote, auth!.jwt as string);
            else response = await editNote({...newNote, id: noteToEdit.id}, auth!.jwt as string);
            const data = await response.json();
            
            if (!response.ok) {
                setFormStatus('error');
                if (data?.errorObject !== undefined) setFormErrors(data.errorObject);
                else setFormErrors({
                    custom: data.message
                });
            } else {
                setFormStatus('success');
            }
        } catch(e) {
            setFormStatus('errorNetwork');
        }
    }

    const handleItemListDone = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const order = Number(target.id.split('_')[1]);
        const listItemsNew = listItems.map(item => {
            if (order === item.order) {
                return {
                    ...item,
                    isDone: !item.isDone
                }
            } else {
                return item
            }
        });
        setListItems([...listItemsNew])
    }

    return (
        <>
            <Box
                component='form'
                onSubmit={handleSubmit}
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
                <TextField 
                    required
                    id='note-form-title'
                    name='noteTitle'
                    label="Note title"
                    error={formErrors?.title}
                    helperText={formErrors?.title}
                    defaultValue={noteToEdit?.title}
                    disabled={formStatus === 'loading'} />
                <TextField
                    required={noteType === 'TEXT'}
                    id='note-form-content'
                    name='content'
                    label="Note content"
                    error={formErrors?.content}
                    multiline
                    minRows={4}
                    maxRows={8}
                    defaultValue={noteToEdit?.content}
                    helperText={formErrors?.content}
                    disabled={formStatus === 'loading'} />
                <Typography variant="subtitle1">
                    Add a check list to the note
                </Typography>
                <ToggleButtonGroup
                    exclusive
                    disabled={noteToEdit?.type !== undefined}
                    color="primary"
                    value={noteType}
                    onChange={handleNoteTypeChange}
                    aria-label="Note Type - text or check list">
                    <ToggleButton value="TEXT" sx={{ width: '50%'}}>Text</ToggleButton>
                    <ToggleButton value="CHECKLIST" sx={{ width: '50%'}}>Check List</ToggleButton>
                </ToggleButtonGroup>
                {
                    noteType === 'CHECKLIST' ?
                        <>
                            {
                                formErrors?.checkList !== undefined ?
                                    <Alert severity="error">{formErrors.checkList}</Alert>:
                                    null
                            }
                            <Paper elevation={3}>
                                <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'lightgray', py: 1, px: 2 }}>
                                    Check list Items
                                </Typography>
                                <List>
                                    {
                                        listItems.sort((a,b) => (a.order - b.order)).map((item) => (
                                            <ListItem key={item.order}>
                                                <ListItemText inset sx={item.isDone ? {
                                                    textDecoration: 'line-through',
                                                    color: 'text.disabled'
                                                } : {}}>
                                                    {item.text}
                                                </ListItemText>
                                                <FormControlLabel control={
                                                    <Checkbox
                                                        name="isComplete"
                                                        checked={item.isDone}
                                                        id={'item-isDone_'+item.order}
                                                        onChange={handleItemListDone} />}
                                                        label="Is task complete?" />
                                                <ListItemSecondaryAction>
                                                    <IconButton title="Remove Item" onClick={() => handleDeleteItem(item.order)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))
                                    }
                                    <ListItem>
                                        <ListItemButton
                                            onClick={handleAddListItem}>
                                            <ListItemIcon sx={{minWidth: '40px'}}>
                                                <AddBoxIcon />
                                            </ListItemIcon>
                                            <ListItemText primary='Add item to end of list'></ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Paper>
                        </> :
                        null
                }
                <Button type="submit" size='large' variant="outlined">
                    { noteToEdit !== undefined ? 'Save changes' : 'Create'}
                </Button>
                <FormAlert status={formStatus} statusMessages={statusMessages} />
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmitItem,
                }}>
                <DialogTitle>
                    Add item
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="text"
                        label="Item text"
                        type="text"
                        fullWidth
                        variant="standard" />
                    <FormControlLabel control={<Checkbox name="isDone" />} label="Is task complete?" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add Item</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default NoteForm;