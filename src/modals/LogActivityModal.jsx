import '../Page.css';
import Button from "react-bootstrap/Button";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Select from 'react-select';
import {goals} from "../constants";

//TODO - why is this being called repeatedly in a loop?
const handleClose = () => console.log("close");//setShowModal(false);

function LogActivityModal({show, setShowModal, activities}) {

    return (
        <Modal
            show={show}
            // onHide={handleClose}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-80w"
            centered
        >
            <link rel="stylesheet" href="bootstrap-multiselect.css" type="text/css"/>
            <Modal.Header>
                <Modal.Title>Log an Activity</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="personalInfo">
                    <Form.Group className="mb-3 align-items-center" controlId="nameInput">
                        <Form.Control type="text" rows={3} placeholder='Activity Name'/>
                    </Form.Group>
                    <Form.Group className="mb-3 align-items-center" controlId="goalInput">
                        <Col>
                            <Select
                                placeholder={"Associated goal(s)"}
                                isMulti
                                name="goals"
                                options={
                                    Object.keys(goals).map(function (key) {
                                        return {
                                            value: key, label: goals[key]
                                        }
                                    })}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 mt-3 align-items-center" controlId="reflection">
                        <Form.Label>Reflection:</Form.Label>
                        <Form.Text className="mx-3">(Optional)</Form.Text>
                        <Form.Control as="textarea" rows={3} placeholder='Any memorable moments? Personal wins?'/>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Rating:</Form.Label>
                        <Form.Range/>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {/*<Button variant="secondary" onClick={handleClose()}>Close</Button>*/}
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LogActivityModal