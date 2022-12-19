import { Button, Container, Grid } from "@mui/material"
import { useEffect, useState } from "react";
import login from "../../event/login";
import { CommonFun } from "../../common/common";
import { ethers } from 'ethers';

// import { FontLogoIcon } from "../../assets/svgs"
import "./style.css"
import { request } from "../../common/request";
import { LocalstorageService } from "../../common/global";

export default () => {
    let storage = new LocalstorageService();
    const [isConnected, setIsConnected] = useState(storage.getItem('isConnected'));
    const [addressFormat, setAddressFormat] = useState(storage.getItem('addressFormat'));
    const [walletAddress, setWalletAddress] = useState(storage.getItem('walletAddress'));
    const [loginToken, setLoginToken] = useState(storage.getItem('loginToken'));
    const [route, setRoute] = useState(window.location.hash.split('/')[window.location.hash.split('/').length - 1]);

    useEffect(() => {
        if (loginToken && isConnected) {
            console.log("Before _initProvider...");
            _initProvider(null);
        }
    }, []);

    function _initProvider(walletAddr: any) {

        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let curSigner = provider.getSigner();
        let wd = walletAddress || walletAddr;
        if (wd != null) {
            console.log("Format addr: ", CommonFun.ellipsis(wd));
            setAddressFormat(CommonFun.ellipsis(wd));
            setIsConnected(true);
            storage.setItem({
                name: 'addressFormat',
                value: CommonFun.ellipsis(wd),
            });
            storage.setItem({
                name: 'isConnected',
                value: true,
            });
        }
        console.log("current signer: ", curSigner);
        login.emit('sendWallet', null);
        login.emit('sendWallet', { address: wd, provider: provider, signer: curSigner, timespan: Number(new Date()) });
        console.log("After sendWallet...");

        return { address: wd, provider: provider, signer: curSigner };
    }

    async function connect() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        } else {
            window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn");
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts[0]) {
            console.log(234)
            setWalletAddress(accounts[0]);
            storage.setItem({ name: 'walletAddress', value: accounts[0] });

            let initProvider = _initProvider(accounts[0]);
            let signText = "Login-upgrade-doge-" + Date.parse(new Date().toString());
            let signContent = await initProvider.signer.signMessage(signText);
            console.log("Sign content :", signContent, accounts[0]);

            const loginRes = await request('login', {
                method: 'post',
                params: {
                    "address": accounts[0],
                    "signData": signText,
                    "signature": signContent
                },
            });
            console.log("Login res :", loginRes);
            if (loginRes?.data.code == 0) {
                console.log("Login Token res :", loginRes.data.data.token);
                storage.setItem({
                    name: 'loginToken',
                    value: loginRes.data.data.token,
                });
                login.emit('isLogin', true);
            }
        }
    }

    console.log(window.location.hash)
    function disConnect() {
        login.emit('sendAddress', null);
        login.emit('sendProvider', null);
        login.emit('sendSigner', null);
        login.emit('isLogin', false);
        setIsConnected(false);
        setAddressFormat(null);
        storage.clear();
        window.location.reload();
    }

    async function signin() {

    }

    return (
        <div id="header">
            <div className="container">
                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                    <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none" style={{ fontSize: '2em' }}>
                        🐶 Uprade Doge
                    </a>
                    <ul className="nav nav-pills">
                        <li>
                            <a href="/#/parser" className={"nav-link px-4 " + (route == 'parser' ? 'active' : 'link-dark')} onClick={() => {
                                setRoute('parser');
                            }}>Parser</a>
                        </li>
                        <li>
                            <a href="/#/notifier" className={"nav-link px-4 " + (route == 'notifier' ? 'active' : 'link-dark')} onClick={() => {
                                setRoute('notifier');
                            }}>Notifier</a>
                        </li>
                        <li><a href="https://docs.upgrade-doge.xyz/" className="nav-link px-4 link-dark">Docs</a></li>
                    </ul>
                    <div className="col-md-3 text-end">
                        {isConnected ?
                            <>
                                <span>{addressFormat} </span>
                                <button type="button" className="btn btn-outline-primary me-2" onClick={disConnect}>Disconnect</button></>
                            :
                            <button type="button" className="btn btn-outline-primary me-2" onClick={connect}>Connect</button>
                        }
                        {/* <button type="button" className="btn btn-primary" onClick={signin}>Signin</button> */}
                    </div>
                </header>
            </div>
            {/* <Container>
                <Grid container>
                    <Grid item xs={7} sm={10}>
                        <div className="logo" title="Go to the top" onClick={() => {
                            window.location.href = '/'
                        }}>
                             <FontLogoIcon></FontLogoIcon> 
                        </div>
                    </Grid>
                    <Grid item xs={2} sm={2} textAlign='center' className="top-btns">
                        <a className="b-body1" href="">Sign Up</a>
                    </Grid>
                </Grid>

            </Container> */}
        </div>
    );

}
