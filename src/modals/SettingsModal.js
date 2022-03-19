import '../Page.css';
import Button from "react-bootstrap/Button";
import React from "react";
import Modal from "react-bootstrap/Modal";

function SettingsModal({show, setShowSettings}) {
    const handleClose = () => {
        setShowSettings(false);
    };

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-90w"
            centered
        >
            <Modal.Header>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                There are no customisable settings in the current version
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SettingsModal