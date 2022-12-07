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
import { useState } from 'react';
import login from '../../../event/login';
import proxyAdminAbi from "../../../common/abis/ProxyAdmin.json";
import { ethers } from 'ethers';

interface Column {
    id: 'index' | 'name' | 'proxy' | 'implement' | 'proxyAdmin'| 'proxyOwner' | 'button';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    // { id: 'button', label: '', minWidth: 180 },
    { id: 'index', label: '#', minWidth: 30 },
    { id: 'name', label: 'Contract\u00a0Name', minWidth: 100 },
    {
        id: 'proxy',
        label: 'Proxy',
    },
    {
        id: 'implement',
        label: 'Implement',
        // format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'proxyAdmin',
        label: 'ProxyAdmin',
        // format: (value: number) => value.toFixed(2),
    },
    {
        id: 'proxyOwner',
        label: 'ProxyAdmin\u00a0Owner',
        // format: (value: number) => value.toFixed(2),
    },
];

interface Data {
    button?: boolean;
    index: number;
    name: string;
    proxy: string;
    implement: string;
    proxyAdmin: string;
    proxyOwner: String;
}

function createData(
    index: number,
    name: string,
    proxy: string,
    implement: string,
    proxyAdmin: string,
    proxyOwner: string
): Data {
    return { index, name, proxy, implement, proxyAdmin, proxyOwner };
}

var rows:Data[] = [
    // createData(1, 'PausableUpgradeable', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723', '0x210899C848A107bd5ec3BEfF3eDfEeAaE7aD8723'),
];

export default function StickyHeadTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [openChangeOwner, setOpenChangeOwner] = useState(false);
    const [curProxyAdmin, setCurProxyAdmin] = useState('');
    const [curProxy, setCurProxy] = useState('');
    const [arr, setArr] = useState([]);
    const [newOwnerAddr, setNewOwnerAddr] = useState(null);
    const [proxyOwnerAddr, setProxyOwnerAddr] = useState('');
    
    const [curAddress, setCurAddress] = useState('');
    const [curProvider, setCurProvider] = useState({});
    const [curSigner, setCurSigner] = useState(undefined);
    const [isFileLoaded, setIsFileLoaded] = useState(false);

    const changeNewAdmin = (e: any) => {
        // setNewOwnerAddr(e.target.value);
    }

    const changeNewOwner = (e: any) => {
        setNewOwnerAddr(e.target.value);
    }
    
    const handleClickOpen = (row: any) => {
        setCurProxyAdmin(row.admin);
        setCurProxy(row.proxy);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseChangeOwner = () => {
        setOpenChangeOwner(false);
    };

    const handleClickOpenChangeOwner = () => {
        console.log("enter handleClickOpenChangeOwner: ", curAddress, proxyOwnerAddr);
        if(curAddress.toLowerCase() == proxyOwnerAddr.toLowerCase()) {
            setOpenChangeOwner(true);
        }else{
            alert("Permission error");
        }
    };

    async function handleSubmitChangeOwner() {
        let proxyAdminObj = new ethers.Contract(curProxyAdmin, proxyAdminAbi, curSigner);
        console.log("proxyAdminObj :", proxyAdminObj.address, proxyOwnerAddr);
        let changeRes = await proxyAdminObj.transferOwnership(newOwnerAddr);
        console.log("Change Owner Res :", changeRes.hash);
        setOpenChangeOwner(false);
    };

    async function handleSubmit() {
        // let proxyAdminObj = new ethers.Contract(curProxyAdmin, proxyAdminAbi, curSigner);
        // console.log("proxyAdminObj :", proxyAdminObj.address);
        // let changeRes = await proxyAdminObj.transferOwnership(proxyOwnerAddr);
        // console.log("Change Owner Res :", changeRes.hash);
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
        rows = [];
        let i = 1;
        data.map((x: any) => {
            rows.push(createData(i, x.name, x.proxy, x.implement, x.proxyAdmin, x.proxyOwner))
            i++;
        });
        setArr(rows as never[])
        setIsFileLoaded(true);
    });

    upload.on('sendOwner', data => {
        setProxyOwnerAddr(data);
    });

    upload.on('sendProxyAdmin', data => {
        setCurProxyAdmin(data);
    });

    login.on('sendWallet', data => {
        setCurAddress(data.address);
        setCurProvider(data.provider);
        setCurSigner(data.signer);
    });

    return (
        <>
            {isFileLoaded? 
            <>
            <div>
                <button type="button" className="btn btn-outline-primary me-2" onClick={handleClickOpenChangeOwner}>Change Proxy Owner</button>
                <br/>
            </div>
            </>
            :""}
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
                            {arr
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row,idx) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                    {
                                                        column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value
                                                    }
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
                        Please enter your new proxy admin owner address here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Current Owner"
                        value={proxyOwnerAddr}
                        disabled={true}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newAddress"
                        label="Proxy Admin Address"
                        fullWidth
                        variant="standard"
                        onChange={changeNewAdmin}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openChangeOwner} onClose={handleCloseChangeOwner}>
                <DialogTitle>Change Owner</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your new proxy admin owner address here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Current Owner"
                        value={proxyOwnerAddr}
                        disabled={true}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newOwnerAddress"
                        label="New Owner Address"
                        fullWidth
                        variant="standard"
                        onChange={changeNewOwner}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChangeOwner}>Cancel</Button>
                    <Button onClick={handleSubmitChangeOwner}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}