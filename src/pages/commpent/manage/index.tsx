import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import upload from '../../../event/upload';

interface Column {
    id: 'index' | 'name' | 'proxy' | 'implement' | 'admin' | 'button';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'button', label: '', minWidth: 180 },
    { id: 'index', label: '#', minWidth: 30 },
    { id: 'name', label: 'Contract\u00a0Name', minWidth: 100 },
    {
        id: 'proxy',
        label: 'Proxy',
    },
    {
        id: 'implement',
        label: 'Implement',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'admin',
        label: 'Proxy\u00a0Admin',
        format: (value: number) => value.toFixed(2),
    },
];

interface Data {
    button?: boolean;
    index: number;
    name: string;
    proxy: string;
    implement: string;
    admin: string;
}

function createData(
    index: number,
    name: string,
    proxy: string,
    implement: string,
    admin: string,
): Data {
    return { index, name, proxy, implement, admin };
}

const rows = [
    createData(1, 'PausableUpgradeable', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723'),
];

export default function StickyHeadTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [current, setCurrent] = React.useState('');

    const handleClickOpen = (row: any) => {
        setCurrent(row.admin)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    upload.on('sendValue', data => {
        data.map((x: any) => {
            rows.push(createData(1, x.name, x.proxy, x.implement, x.admin))
        })
    })

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.index}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {
                                                            column.id == "button" ? <Button variant="contained"
                                                                onClick={() => { handleClickOpen(row) }}
                                                            >Change Admin</Button> : (
                                                                column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value)}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your new proxy admin address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Current Admin"
                        value={current}
                        disabled={true}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Proxy Admin Address"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}