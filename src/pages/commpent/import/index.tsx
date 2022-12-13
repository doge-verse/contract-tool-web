import { Button } from '@mui/material';
import React, { Component, useState } from 'react';
import upload from '../../../event/upload';
import "./style.css";
import { ethers } from 'ethers';
import proxyAdminAbi from "../../../common/abis/ProxyAdmin.json";
import login from '../../../event/login';

interface ProxyData {
    name: string;
    proxy: string;
    implement: string;
    proxyAdmin: string;
    proxyOwner: string;
}

function createProxyData(
    name: string,
    proxy: string,
    implement: string,
    proxyAdmin: string,
    proxyOwner: string
): ProxyData {
    return { name, proxy, implement, proxyAdmin, proxyOwner };
}

export default () => {
    async function showFile(e: any, address: any, curProvider: any, curSigner: any) {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const networkFileText = ((e?.target?.result) || '').toString();
            const networkFileJson = JSON.parse(networkFileText);
            let result: ProxyData[] = [];
            if (networkFileJson != null && networkFileJson != undefined) {
                console.log("admin addr :", networkFileJson['admin'].address);
                let proxyAdminObj = new ethers.Contract(networkFileJson['admin'].address, proxyAdminAbi, curSigner);
                console.log("proxyAdminObj :", proxyAdminObj.address);
                let curOwnerAddr = await proxyAdminObj.owner();
                console.log("proxyAdmin owner:", curOwnerAddr);
                for (var i in networkFileJson['proxies']) {
                    let curImplAddr = await proxyAdminObj.getProxyImplementation(networkFileJson['proxies'][i].address.toString());
                    let curProxyAdminAddr = await proxyAdminObj.getProxyAdmin(networkFileJson['proxies'][i].address.toString());
                    for (var j in networkFileJson['impls']) {
                        if (networkFileJson['impls'][j].address == curImplAddr) {
                            let storageList = networkFileJson['impls'][j].layout.storage;
                            let storageItem = storageList[storageList.length - 1];
                            let contractName = storageItem.contract;
                            // tempItem.name = contractName;
                            // tempItem.proxy = networkFileJson['proxies'][i].address.toString();
                            // tempItem.implement = curImplAddr;
                            // tempItem.admin = curAdminAddr;
                            result.push(createProxyData(contractName, networkFileJson['proxies'][i].address.toString(), curImplAddr, curProxyAdminAddr, curOwnerAddr));
                            console.log("Data from blockchain:", i, j, contractName, curImplAddr);

                            setLoadingStatus(" (Loading... "+i+"/"+networkFileJson['proxies'].length+")");
                        }
                    }
                }
                setLoadingStatus('');
                upload.emit('sendValue', result);
                upload.emit('sendOwner', curOwnerAddr);
                upload.emit('sendProxyAdmin', networkFileJson['admin'].address);

            }

        };
        reader.readAsText(e.target.files[0])
    }

    const [curAddress, setCurAddress] = useState(null);
    const [curProvider, setCurProvider] = useState(null);
    const [curSigner, setCurSigner] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState('');
    
    login.on('sendWallet', data => {
        // console.log("Import wallet :", data);
        setCurAddress(data.address);
        setCurProvider(data.provider);
        setCurSigner(data.signer);
    });
    return (
        <div className='upload'>
            <h3>Import Openzeppelin Networks File {loadingStatus} </h3>
            <input style={{ 'display': 'none' }} type="file" id='fileupload' onChange={(e) => showFile(e, curAddress, curProvider, curSigner)} />
            <Button onClick={() => { document.getElementById('fileupload')?.click() }}>Click to Import</Button>
        </div>
    );
}
