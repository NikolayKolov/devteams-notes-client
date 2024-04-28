import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AuthenticationContextWrapper } from "../../../contexts/authenticationContext";
import useSWR from 'swr';
import getNotesByUser from "../../../api/getNotesByUser";
import { GridColDef, GridRowParams, GridActionsCellItem } from "@mui/x-data-grid";
import PaginatedSortTable from "../../SortPaginatedTable";
import useWindowSize from "../../../hooks/useWindowResize";
import AbcIcon from '@mui/icons-material/Abc';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteNoteDialog from "./DeleteNoteDialog";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";

const NotesList = () => {
    const [auth,] = useContext(AuthenticationContextWrapper);
    const fetcher = () => getNotesByUser(auth?.user?.userId ?? '', auth?.jwt ?? '');
    const { data, error, isLoading, isValidating } = useSWR('/notes/list'+auth?.user?.userId, fetcher);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();

    // Each row of the skeleton of the loading table
    const SkeletonRow = <Grid container spacing={matches ? 3 : 1}>
        <Grid item xs={8} md={6}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem'}}/>
        </Grid>
        <Grid item xs={2} md={1}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }}/>
        </Grid>
        <Grid item xs={2} md={3}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }}/>
        </Grid>
        <Grid item sx={{ display: {
            xs: 'none',
            md: 'initial'
        }}} md={2}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '2rem' }}/>
        </Grid>
    </Grid>;

    const array = [];
    for (let i = 0; i < 10; i++) {
        array.push(i + 1);
    }

    const { windowWidth } = useWindowSize();
    const columnVisibility = {
        id: false,
        type: true,
        createdAt: true
    }

    if (windowWidth < 768) {
        columnVisibility.createdAt = false;
    }
    if (windowWidth < 420) {
        columnVisibility.type = false;
    }


    if (isLoading) return(
        <Paper elevation={3} sx={{m: 3, p: 2}}>
            <Skeleton animation="wave" variant="text" sx={{ fontSize: '2.5rem' }} />
            {
                array.map(row => (
                    <React.Fragment key={row}>{SkeletonRow}</React.Fragment>
                ))
            }
        </Paper>
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = error ? [] : (data as unknown as Array<any>).map((row: any) => {
        return {
            id: row.id,
            title: row.title,
            type: row.type,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isListComplete: row.type === 'CHECKLIST' && row.listItems.every((item: any) => item.isDone === true)
        }
    });

    const columns: GridColDef<(typeof rows)[number]>[] = error ? [{ field: 'title', headerName: 'Note name', flex: 3 }] :  [
        { field: 'id', headerName: 'id', },
        { field: 'title', headerName: 'Note name', flex: 3, renderCell(params) {
            if (params.row.isListComplete) return (
                <Tooltip title={params.value}>
                    <Link href={`/note/${params.row.id}`} style={{textDecoration: 'line-through'}}>{params.value}</Link>
                </Tooltip>);
            else return (
                <Tooltip title={params.value}>
                    <Link href={`/note/${params.row.id}`}>{params.value}</Link>
                </Tooltip>);
        }, },
        { field: 'type', headerName: 'Note type', flex: 2, renderCell(params) {
            return (
                <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                    {params.value === 'TEXT' ? <AbcIcon color="primary" /> : <ChecklistIcon color="primary" />}
                    <span>{params.value === 'TEXT' ? 'Text' : 'List'}</span>
                </Stack>
            )
        }, },
        { field: 'createdAt', headerName: 'Created at', flex: 2, valueGetter: (value: string) => {
            return new Date(value).toLocaleDateString() + ' '+ new Date(value).toLocaleTimeString();
        } },
        { field: 'updatedAt', headerName: 'Last modified', flex: 2, renderCell: (params) => {
            const displayDateTime = new Date(params.value).toLocaleDateString() + ' '+ new Date(params.value).toLocaleTimeString();
            return (
                <Tooltip title={displayDateTime}>
                    <span>{displayDateTime}</span>
                </Tooltip>);
        } },
        { field: 'actions', type: 'actions', headerName: 'Actions',flex: 2, getActions:( params: GridRowParams) => [
            <GridActionsCellItem
                label='Edit'
                showInMenu
                icon={<EditIcon />}
                onClick={() => navigate('/edit/'+params.id)} />,
            <DeleteNoteDialog
                label="Delete"
                showInMenu
                icon={<DeleteIcon />}
                deleteNoteId={params.id}
                closeMenuOnClick={false} />
        ]}
    ];

    let ErrorToDisplay;
    if (error) {
        try {
            const errorObject = JSON.parse(error.message);
            ErrorToDisplay = <Alert severity="error" sx={{mb: 2}}>{errorObject.message ? errorObject.message : 'An error has occured'}</Alert>;
        } catch {
            ErrorToDisplay = <Alert severity="error" sx={{mb: 2}}>{error.message ? error.message : 'An error has occured'}</Alert>;
        }
    }

    return (
        <Paper elevation={3} sx={{m: {xs: 1, md: 3}, p: {xs: 0, md: 1}, width: {xs: 'calc(100% - 16px)', md: 'calc(100% - 48px)' }}}>
            { error && ErrorToDisplay }
            <PaginatedSortTable rows={rows} columns={columns} columnVisibility={columnVisibility} loading={isValidating} />
        </Paper>
    );
}

export default NotesList;