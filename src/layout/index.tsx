import { Container, Grid } from "@mui/material";
// import Footer from "./footer";
import Header from "./header";


export const Layout = (props: any) => {
    const childrenNode =
        props.children instanceof Array
            ? props.children
            : [props.children];
    return (
        <div
            id="main"
            data-theme='dark'
        >
            <div className="hidden" >
                <Header />
                <Container>
                    <div id="content">
                        {childrenNode}
                    </div>
                </Container>
            </div>
            {/* <Footer /> */}
        </div>

    )

}