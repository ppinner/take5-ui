import '../Page.css';
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Select from 'react-select';
import {goals} from "../constants";
import {alertService} from "../alert/alert-service";
import {dateForPicker, dateFromDateString} from "../ProfilePageContent";

function SignupModal({showSignupModal, setShowSignupModal}) {
    const [name, setName] = useState(null);
    const [dob, setDob] = useState(null);
    const [goal, setGoal] = useState(null);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);

    const handleClose = () => {
        clearModal();
        alertService.clear();
        setShowSignupModal(false);
    };

    const checkPasswords = (password, password2) => {
        return password === password2;
    };

    const clearModal = () => {
        setName(null);
        setGoal(null);
        setDob(null);
        setUsername(null);
        setPassword(null);
        setPassword2(null);
    };

    const rollbackUserChanges = (userId) => {
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            };

            fetch(`http://localhost:8081/api/users/${userId}`, requestOptions)
                .then(async res => {
                    const data = await res.json();

                    if (!res.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || res.status;
                        return Promise.reject(error);
                    }
                })
        } catch(e){
            console.log("Error when rolling back signup process " + e)
        }
    };

    const submitProfile = () => {
        if (username != null && password != null && checkPasswords(password,password2)) {
            const user = {
                "name": name,
                "focus": goal,
                "dob": dob,
                "focusStart": new Date(),
            };

            const userRequestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            };

            fetch(`http://localhost:8081/api/users`, userRequestOptions)
                .then(async res => {
                    const data = await res.json();

                    if (!res.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || res.status;
                        return Promise.reject(error);
                    }

                    const account = {
                        "id": username,
                        "password": password,
                        "userId": data.id
                    };

                    const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(account)
                    };

                    fetch(`http://localhost:8081/api/login/create`, requestOptions)
                        .then(async res => {
                            const data = await res.json();

                            if (!res.ok) {
                                // get error message from body or default to response status
                                const error = (data && data.message) || res.status;
                                return Promise.reject(error);
                            }
                            handleClose();
                            alertService.success('New account created! Please login with your username and password');
                        })
                        .catch(error=> {
                            rollbackUserChanges(account.userId);
                        });
                })
                .catch(error => {
                    alertService.error('Could not create user with provided username - it may already be in use');
                });
        } else {
            alertService.error('Error - ensure valid email and matching passwords provided');
        }
    };

    return (
        <Modal
            show={showSignupModal}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-80w"
            centered
        >
            <link rel="stylesheet" href="bootstrap-multiselect.css" type="text/css"/>
            <Modal.Header>
                <Modal.Title>Signup</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="personalInfo">
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="nameInput">
                        <Form.Label column lg={4}>Name:</Form.Label>
                        <Col>
                            <Form.Control type="text"
                                          onChange={(e) => setName(e.target.value)}
                                          placeholder={name}/>
                            <Form.Text className="text-muted">
                                This is what the Take5 will call you!
                            </Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="emailInput">
                        <Form.Label column lg={4}>Email:</Form.Label>
                        <Col>
                            <Form.Control type="email"
                                          onChange={(e) => setUsername(e.target.value)}/>
                            <Form.Text className="text-muted">
                                This should be your email address
                            </Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="passwordInput">
                        <Form.Label column lg={4}>Password:</Form.Label>
                        <Col>
                            <Form.Text className="text-muted">
                                Password:
                            </Form.Text>
                            <Form.Control type="password"
                                          onChange={(e) => setPassword(e.target.value)}/>
                            <Form.Text className="text-muted">
                                Password Match:
                            </Form.Text>
                            <Form.Control type="password"
                                          onChange={(e) => setPassword2(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="dobInput">
                        <Form.Label column lg={4}>Date of Birth:</Form.Label>
                        <Col>
                            <Form.Control
                                type="date"
                                value={dob ? dateForPicker(dob) : ''}
                                onfocus={dateForPicker(dob)}
                                placeholder={dob ? dateForPicker(dob) : "dd/mm/yyyy"}
                                onChange={(e) => setDob(dateFromDateString(e.target.value))}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 align-items-center" controlId="goalInput">
                        <Form.Label column lg={4}>Primary Goal:</Form.Label>
                        <Col>
                            <Select
                                name="goals"
                                isSearchable={false}
                                options={
                                    Object.keys(goals).map(function (key) {
                                        return {
                                            value: key, label: goals[key]
                                        }
                                    })
                                }
                                className="goalSelect"
                                onChange={(e) => {
                                    setGoal(e.value)
                                }}
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={() => submitProfile()}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignupModal