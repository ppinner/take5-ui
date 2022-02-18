import './Login.css';
import {useEffect, useState} from "react";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";

function LoginModal({setUserId, showLoginModal, setShowLoginModal, setIsLoggedIn}) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const handleClose = () => {
        setShowLoginModal(false);
        setUsername(null);
        setPassword(null);
    };

    const login = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        };

        if (username != null && password != null) {
            fetch(`http://localhost:8081/api/login/`, requestOptions)
                .then(res => {
                    return res.json()
                })
                .then(result => {
                    if (result != null) {
                        setUserId(result.userId);
                        // setIsLoggedIn(true)
                    }
                })
                .catch((error) => console.log(error))
        }
    };

    return (
        <Modal show={showLoginModal}
               backdrop="static"
               keyboard={false}
               dialogClassName="modal-90w"
               centered
        >
            <Modal.Header>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="loginDetails">
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="nameInput">
                        <Form.Label column lg={4}>Username:</Form.Label>
                        <Col>
                            <Form.Control type="email"
                                          onChange={(e) => setUsername(e.target.value)}
                                          defaultValue={username}/>
                            <Form.Text className="text-muted">
                                This should be your email address
                            </Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="nameInput">
                        <Form.Label column lg={4}>Name:</Form.Label>
                        <Col>
                            <Form.Control type="password"
                                          onChange={(e) => setPassword(e.target.value)}
                                          defaultValue={password}/>
                        </Col>
                    </Form.Group>
                </Form>
                <Button variant="primary" type="submit" className={"primaryButton float-end"} onClick={login}>
                    Login
                </Button>
                <Button variant="outline-secondary" className={"float-end mx-1"} onClick={handleClose}>Close</Button>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;
