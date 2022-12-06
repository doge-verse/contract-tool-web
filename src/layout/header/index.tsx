import { Button, Container, Grid } from "@mui/material"
import { useEffect } from "react";
import login from "../../event/login";
// import { FontLogoIcon } from "../../assets/svgs"
import "./style.css"

export default () => {
    function signin(){
        login.emit('sendValue', 'address')
    }

    return (
        <div id="header">
            <div className="container">
                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                    <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap" /></svg>
                    </a>

                    <div className="col-md-3 text-end">
                        <button type="button" className="btn btn-outline-primary me-2" onClick={signin}>Login</button>
                        <button type="button" className="btn btn-primary">Sign-up</button>
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