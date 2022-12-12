import * as React from 'react';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { ethers } from 'ethers';
import upload from '../../event/upload';
import login from '../../event/login';
import proxyAdminAbi from "../../common/abis/ProxyAdmin.json";
import { LocalstorageService } from '../../common/global';
import Autocomplete from '@mui/material/Autocomplete';
import { request } from '../../common/request';
import Alert from '@mui/material/Alert';

import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Column {
    id: 'index' | 'name' | 'proxyOwner' | 'network' | 'proxyAddress' | 'updatedAt' | 'button';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: any) => string;
}

const networks = [
    { label: 'Eth Mainnet', value: 1 },
    { label: 'Polygon Mainnet', value: 137 },
    { label: 'Goerli Testnet', value: 5 },
];

const columns: readonly Column[] = [
    // { id: 'index', label: '#', minWidth: 30 },
    { id: 'name', label: 'Contract\u00a0Name', minWidth: 100 },
    {
        id: 'network',
        label: 'Network',
        format: (value: number) => (networks.filter((x: any) => x.value == value)[0].label).toString()
    },
    {
        id: 'proxyOwner',
        label: 'Proxy Owner',
        format: (value: string) => (value.substring(0, value.length / 2) + ' ' + value.substring(value.length / 2, value.length).toString()),
    },
    {
        id: 'proxyAddress',
        label: 'ProxyAdmin',
        format: (value: string) => (value.substring(0, value.length / 2) + ' ' + value.substring(value.length / 2, value.length).toString()),
        // format: (value: number) => value.toFixed(2),
    },
    {
        id: 'updatedAt',
        label: 'Last\u00a0Changed',
        format: (value: number) => (new Date((value * 1000))).toISOString(),
    },
    { id: 'button', label: '', minWidth: 180 },
];

interface Data {
    button?: boolean;
    index: number;
    name: string;
    proxy: string;
    network: string;
    proxyAdmin: string;
    lastchanged: String;
}

function createData(
    index: number,
    name: string,
    proxy: string,
    network: string,
    proxyAdmin: string,
    lastchanged: string
): Data {
    return { index, name, proxy, network, proxyAdmin, lastchanged };
}

var rows: Data[] = [
    // createData(1, 'PausableUpgradeable', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723'),
];


function Row(props: { row: ReturnType<typeof createData> }, columns: any, idx: Number) {
    const row = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                {columns.map((column: any) => {
                    const value = row[column.id];
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {
                                column.id == "button" ? <Button variant="contained"
                                    onClick={() => { }}
                                >Histories</Button> : (
                                    column.format
                                        ? column.format(value)
                                        : value)
                            }


                        </TableCell>
                    );
                })}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={true} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={1}>
                                        <TableCell component="th" scope="row">
                                            {1}
                                        </TableCell>
                                        <TableCell>{1}</TableCell>
                                        <TableCell align="right">{1}</TableCell>
                                        <TableCell align="right">
                                            {2}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export default function StickyHeadTable() {
    let storage = new LocalstorageService();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openChangeOwner, setOpenChangeOwner] = useState(false);
    const [arr, setArr] = useState([]);
    const [alert, setAlert] = useState(false);
    const [currentName, setCurrentName] = useState('');
    const [proxyAdminAddress, setProxyAdminAddress] = useState('');
    const [email, setEmail] = useState('');
    const [network, setNetwork] = useState('');


    const changeName = (e: any) => {
        setCurrentName(e.target.value);
    }

    const changeEmail = (e: any) => {
        setEmail(e.target.value);
    }

    const changeNetwork = (e: any, newInputValue: any, index: any) => {
        console.log(networks.filter((x: any) => x.label == newInputValue)[0].value)
        setNetwork(networks.filter((x: any) => x.label == newInputValue)[0].value);
    }

    const changeProxyAdmin = (e: any) => {
        setProxyAdminAddress(e.target.value);
    }


    const handleCloseChangeOwner = () => {
        setOpenChangeOwner(false);
    };


    const handleSubmitChangeOwner = async () => {
        console.log(storage.getItem("loginToken"))
        if (currentName == '' || email == '' || network == '' || proxyAdminAddress == '') {
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 3000);
            return;
        }
        const res = await request('notifier', {
            method: 'post',
            headers: {
                'Authorization': storage.getItem("loginToken")
            },

            data: {
                "contractName": currentName,
                "email": email,
                "network": network,
                "proxyAddress": proxyAdminAddress
            }
        });
        if (res?.data?.code == 0) {
            setOpenChangeOwner(false);
        }
    };
    const fetchData = useCallback(
        async (page: number = 0, pageSize: number = 20) => {
            try {
                const res = await request('notifier', {
                    method: 'get',
                    headers: {
                        'Authorization': storage.getItem("loginToken")
                    }
                });
                console.log(res);
                if (res.data.code == 0) {
                    setArr(res.data.data.list)
                }
            } catch (e) {
            }
        },
        [],
    );
    useEffect(() => {
        fetchData();
    }, []);


    const handleClickOpenAddNotifier = () => {
        setOpenChangeOwner(true)
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            {storage.getItem('loginToken') ?
                <>
                    <div>
                        <button type="button" className="btn btn-outline-primary me-2" onClick={handleClickOpenAddNotifier}>Notifier</button>
                        <br />
                    </div>
                    <br />
                </>
                : ""}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ height: 440 }}>
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
                            {arr
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, idx) => {
                                    return (Row(row, columns, idx));
                                    return (
                                        <>
                                            <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {
                                                                column.id == "button" ? <Button variant="contained"
                                                                    onClick={() => { }}
                                                                >Histories</Button> : (
                                                                    column.format
                                                                        ? column.format(value)
                                                                        : value)
                                                            }


                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                    <Collapse in={true} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                History
                                                            </Typography>
                                                            <Table size="small" aria-label="purchases">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Date</TableCell>
                                                                        <TableCell>Customer</TableCell>
                                                                        <TableCell align="right">Amount</TableCell>
                                                                        <TableCell align="right">Total price ($)</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow key={1}>
                                                                        <TableCell component="th" scope="row">
                                                                            {1}
                                                                        </TableCell>
                                                                        <TableCell>{1}</TableCell>
                                                                        <TableCell align="right">{1}</TableCell>
                                                                        <TableCell align="right">
                                                                            {2}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </>
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

            <Dialog open={openChangeOwner} onClose={handleCloseChangeOwner}>
                <DialogTitle>Add Notifier</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your information.
                    </DialogContentText>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={[
                            { label: 'Eth Mainnet', year: 1 },
                            { label: 'Polygon Mainnet', year: 137 },
                            { label: 'Goerli Testnet', year: 5 },
                        ]}
                        renderInput={(params) => <TextField {...params} label="Network" />}
                        onInputChange={changeNetwork}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Contract Name"
                        fullWidth
                        variant="standard"
                        onChange={changeName}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="proxyAdmin"
                        label="Proxy Admin"
                        fullWidth
                        variant="standard"
                        onChange={changeProxyAdmin}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        fullWidth
                        variant="standard"
                        onChange={changeEmail}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChangeOwner}>Cancel</Button>
                    <Button onClick={handleSubmitChangeOwner}>Confirm</Button>
                </DialogActions>
                <Alert severity="warning" hidden={!alert}
                    sx={{
                        'position': 'fixed',
                        'top': '25%',
                        'zIndex': '999',
                        'left': '45%',
                    }}
                >
                    Incomplete content!
                </Alert>
            </Dialog>
        </>
    );
}

