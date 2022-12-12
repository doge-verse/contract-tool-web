import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { LocalstorageService } from '../../common/global';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import TablePagination from '@mui/material/TablePagination';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { ethers } from 'ethers';
import upload from '../../event/upload';
import login from '../../event/login';
import proxyAdminAbi from "../../common/abis/ProxyAdmin.json";
import Autocomplete from '@mui/material/Autocomplete';
import { request } from '../../common/request';
import Alert from '@mui/material/Alert';



const networks = [
    { label: 'Eth Mainnet', value: 1 },
    { label: 'Polygon Mainnet', value: 137 },
    { label: 'Goerli Testnet', value: 5 },
];


function createData(
    id: string,
    name: string,
    calories: string,
    fat: string,
    carbs: string,
    protein: string,
) {
    return {
        id,
        name,
        calories,
        fat,
        carbs,
        protein,
        history: [],
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const [history, setHistory] = useState([])

    let storage = new LocalstorageService();

    const fetchData = useCallback(
        async (id: any) => {
            try {
                const res = await request('notifier/history?contractID=' + id, {
                    method: 'get',
                    headers: {
                        'Authorization': storage.getItem("loginToken")
                    }
                });
                setHistory(res.data.data.list)
            } catch (e) {
            }
        },
        [],
    );


    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open);
                            console.log(2);
                            fetchData(row.id)
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Previous Owner</TableCell>
                                        <TableCell align="right">New Owner</TableCell>
                                        <TableCell align="right">Update TX</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((historyRow, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell component="th" scope="row">
                                                {
                                                    new Date((historyRow['updateTime'] * 1000))
                                                        .toISOString()
                                                        .replace('T', ' ')
                                                        .replace('.000Z', '')
                                                }
                                            </TableCell>
                                            <TableCell>{historyRow['previousOwner']}</TableCell>
                                            <TableCell align="right">{historyRow['newOwner']}</TableCell>
                                            <TableCell align="right">{historyRow['updateTX']}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable() {
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
        setNetwork(networks?.filter((x: any) => x.label == newInputValue)[0].value.toString());
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
                if (res.data.code == 0) {
                    setArr(res.data.data.list.map((x: any) => {
                        return createData(
                            x.id,
                            x.name,
                            networks.filter((_x: any) => _x.value == x.network)[0].label,
                            (x.proxyOwner.substring(0, x.proxyOwner.length / 2)
                                + ' '
                                + x.proxyOwner.substring(x.proxyOwner.length / 2, x.proxyOwner.length)),
                            (x.proxyAddress.substring(0, x.proxyAddress.length / 2)
                                + ' '
                                + x.proxyAddress.substring(x.proxyAddress.length / 2, x.proxyAddress.length)),
                            (new Date((x.createdAt * 1000)))
                                .toISOString()
                                .replace('T', ' ')
                                .replace('.000Z', '')
                        )
                    }))
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
            {
                storage.getItem('loginToken') ?
                    <>
                        <div>
                            <button type="button" className="btn btn-outline-primary me-2" onClick={handleClickOpenAddNotifier}>Notifier</button>
                            <br />
                        </div>
                        <br />
                    </>
                    : ""
            }

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Contract&nbsp;Name</TableCell>
                            <TableCell align="right">Network</TableCell>
                            <TableCell align="right">Proxy Owner</TableCell>
                            <TableCell align="right">Proxy Address</TableCell>
                            <TableCell align="right">Last&nbsp;Changed </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {arr.map((row, idx) => (
                            <Row key={idx} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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