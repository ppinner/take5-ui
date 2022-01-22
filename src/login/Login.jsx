import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';


import React, {useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Row, Col} from 'react-bootstrap';
import logo from "../Take5FullLogoCropped.png";
import Image from "react-bootstrap/Image";

function Login({setIsLoggedIn, setUserId, setUser}) {
    const userId = "61cc7e34b137a57798047db1"; //TODO - use actual login to get this info

    const login = () => {
        setUserId(userId);
        if (userId)
            setIsLoggedIn(true)
    };

    useEffect(() => {
        fetch(`http://localhost:8081/api/users/${userId}`)
            .then(res => res.json())
            .then(result => setUser(result))
            .catch((error) => console.log(error))
    }, []);

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
                        <Button variant="primary" className="primaryButton" onClick={login}>Login</Button>
                    </Row>
                    <Row>
                        <Button variant="outline-secondary" className="secondaryButton mt-2">Sign Up</Button>
                    </Row>
                </Container>
            </Col>
        </Container>
    );
}

export default Login;
