import Button from "react-bootstrap/Button";
import React from "react";
import Modal from "react-bootstrap/Modal";
import './Page.css';


function LogActivityModal() {
    return (
        <Modal>
            <Modal.Header closeButton>
                <Modal.Title>Log an Activity</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Modal body text goes here.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LogActivityModal