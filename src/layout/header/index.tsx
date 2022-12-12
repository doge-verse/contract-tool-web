import { Button, Container, Grid } from "@mui/material"
import { useEffect, useState } from "react";
import login from "../../event/login";
import { CommonFun } from "../../common/common";
import { ethers } from 'ethers';

// import { FontLogoIcon } from "../../assets/svgs"
import "./style.css"

export default () => {
    const [isConnected, setIsConnected] = useState(false);
    const [addressFormat, setAddressFormat] = useState(null);

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
        }
        // console.log("current address: ", JSON.stringify());
        login.emit('sendWallet', { address: walletAddress, provider: provider, signer: curSigner });

        //
        let signText = "Login upgrade-doge : "+Date.parse(new Date().toString());
        let signContent = await curSigner.signMessage(signText);
        console.log("Sign content :", signContent);

    }

    function disConnect() {
        login.emit('sendAddress', null);
        login.emit('sendProvider', null);
        login.emit('sendSigner', null);
        setIsConnected(false);
        setAddressFormat(null);
    }

    async function signin() {

    }

    return (
        <div id="header">
            <div className="container">
                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                    <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap" /></svg>
                    </a>


                    <ul className="nav  col-md-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="/" className="nav-link px-2 link-secondary">Main</a></li>
                        <li><a href="/notifier" className="nav-link px-2 link-dark">Notifier</a></li>
                    </ul>
                    <div className="col-md-5 text-end">
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