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

    async function connect() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        } else {
            window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn");
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let walletAddress = accounts[0];
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let curSigner = provider.getSigner();

        if (walletAddress != null) {
            console.log("Format addr: ", CommonFun.ellipsis(walletAddress));
            setAddressFormat(CommonFun.ellipsis(walletAddress));
            setIsConnected(true);
            storage.setItem({
                name: 'addressFormat',
                value: CommonFun.ellipsis(walletAddress),
              })
            storage.setItem({
                name: 'isConnected',
                value: true,
              })
        }
        // console.log("current address: ", JSON.stringify());
        login.emit('sendWallet', { address: walletAddress, provider: provider, signer: curSigner });

        //
        let signText = "Login-upgrade-doge-" + Date.parse(new Date().toString());
        let signContent = await curSigner.signMessage(signText);
        console.log("Sign content :", signContent);

        const loginRes = await request('login', {
            method: 'post',
            params: {
                "address": walletAddress,
                "signData": signText,
                "signature": signContent
            },
        });
        console.log("Login res :", loginRes);
        if (loginRes?.code == 0) {
            login.emit('isLogin', true);
        }
    }

    function disConnect() {
        login.emit('sendAddress', null);
        login.emit('sendProvider', null);
        login.emit('sendSigner', null);
        login.emit('isLogin', false);
        setIsConnected(false);
        setAddressFormat(null);
        storage.clear()
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
                    <ul className="nav  col-md-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="/" className="nav-link px-2 link-dark">Parser</a></li>
                        <li><a href="/notifier" className="nav-link px-2 link-dark">Notifier</a></li>
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
    )
}