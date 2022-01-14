import './Page.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import Header from "./Header";
import LogActivityModal from "./LogActivityModal";
import Footer from "./Footer";
import Home from "./Home";

function Page() {
    return (
        <Container className="App">
            <Header/>

            {/*page content options*/}
            <Home />

            {/*modals*/}
            <LogActivityModal/>


            <Footer/>
        </Container>
    );
}

export default Page