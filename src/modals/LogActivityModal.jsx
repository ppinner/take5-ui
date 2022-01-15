import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import '../Page.css';
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

function LogActivityModal() {

    return (
        <Modal>
            <Modal.Header closeButton>
                <Modal.Title>Log an Activity</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="personalInfo">
                    <p>free text search</p>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="goalInput">
                        <Form.Label column lg={4}>Primary Goal:</Form.Label>
                        <Col>
                            <InputGroup>
                                <Form.Control type="text" placeholder='Select a Goal'/>
                                <DropdownButton
                                    variant="outline-secondary"
                                    id="goalDropdown"
                                    align="end"
                                    title=""
                                >
                                    <Dropdown.Item href="#">Mindfulness</Dropdown.Item>
                                    <Dropdown.Item href="#">Connection</Dropdown.Item>
                                    <Dropdown.Item href="#">Learning</Dropdown.Item>
                                    <Dropdown.Item href="#">Physical Activity</Dropdown.Item>
                                    <Dropdown.Item href="#">Giving</Dropdown.Item>
                                </DropdownButton>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 align-items-center" controlId="nameInput">
                        <Form.Label column lg={4}>Name:</Form.Label>
                        <Col>
                            <Form.Control type="textarea" rows={5} placeholder='Name'/>
                        </Col>
                    </Form.Group>
                    <p>rating</p>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LogActivityModal