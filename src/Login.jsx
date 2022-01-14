import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Row, Col} from 'react-bootstrap';

function Login() {
    return (
        <Container className="Login">
            <Row>
                <h1 className="header">
                    Welcome to Take5
                </h1>
            </Row>

            <Row className="mx-0">
                <Button as={Col} variant="primary">Login</Button>
                <Button as={Col} variant="secondary" className="mx-2">Sign Up</Button>
            </Row>
        </Container>
    );
}

export default Login;
