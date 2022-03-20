import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import {Col, Container, Row} from 'react-bootstrap';
import logo from "../Take5FullLogoCropped.png";
import Image from "react-bootstrap/Image";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import {Alert} from "../alert/Alert";
import {alertService} from "../alert/alert-service";

function Login({setLoggedIn}) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const showLogin = (bool) => {
        setShowLoginModal(bool);
        alertService.clear()
    };

    const showSignup = (bool) => {
        setShowSignupModal(bool);
        alertService.clear()
    };

    return (
        <Container className="Login d-flex">
            <Col className="header .flex-grow-1">
                <Image src={logo} alt="Logo" className="logo"/>
            </Col>
            <Col className="mx-4 d-flex flex-column justify-content-center">
                <h1 className="mt-4">
                    Welcome
                </h1>
                <text>Start taking Steps to Wellbeing and see the results!</text>
                <Container className="mt-4">
                    <Row>
                        <Button variant="primary" className="primaryButton"
                                onClick={() => setShowLoginModal(true)}>Login</Button>
                    </Row>
                    <Row>
                        <Button variant="outline-secondary" className="secondaryButton mt-2"
                                onClick={() => setShowSignupModal(true)}>Sign Up</Button>
                    </Row>
                    <Alert/>
                </Container>
            </Col>
            <LoginModal showLoginModal={showLoginModal} setShowLoginModal={showLogin}
                        setLoggedIn={setLoggedIn}/>
            <SignupModal showSignupModal={showSignupModal} setShowSignupModal={showSignup}
                         setShowLoginModal={setShowLoginModal}/>
        </Container>
    );
}

export default Login;
