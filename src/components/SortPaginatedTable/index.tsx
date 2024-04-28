import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PaginatedSortTable = (props: any) => {
    const { rows, columns, columnVisibility, loading } = props;

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            loading={loading}
            pageSizeOptions={[2,5,10,20,50]}
            autoHeight
            sx={{
                border: 'none'
            }}
            columnVisibilityModel={columnVisibility}
        />
    )
}

export default PaginatedSortTable;