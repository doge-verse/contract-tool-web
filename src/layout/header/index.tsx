import { Button, Container, Grid } from "@mui/material"
import { useEffect, useState } from "react";
import login from "../../event/login";
import {ethers} from 'ethers';

// import { FontLogoIcon } from "../../assets/svgs"
import "./style.css"

export default () => {
    const [isConnected, setIsConnected] = useState(false);

    async function connect(){
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        } else {
            window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn");
            return;
        }

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        let walletAddress = accounts[0];
        if(walletAddress != null) {
            setIsConnected(true);
        }
        console.log("current address: ", walletAddress);
        login.emit('sendValue', walletAddress);
    }

    function disConnect(){
        login.emit('sendValue', null);
        setIsConnected(false);
    }

    async function signin(){

    }

    return (
        <div id="header">
            <div className="container">
                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                    <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap" /></svg>
                    </a>

                    <div className="col-md-4 text-end">
                        {isConnected? 
                            <button type="button" className="btn btn-outline-primary me-2" onClick={disConnect}>Disconnect</button>
                            :
                            <button type="button" className="btn btn-outline-primary me-2" onClick={connect}>Connect</button>
                        }
                        <button type="button" className="btn btn-primary" onClick={signin}>Signin</button>
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