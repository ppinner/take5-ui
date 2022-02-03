import '../Page.css';
import Button from "react-bootstrap/Button";
import React from "react";
import Modal from "react-bootstrap/Modal";

function HelpModal({show, setShowHelp}) {
    const handleClose = () => {
        setShowHelp(false);
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
                <Modal.Title>Helplines:</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <ul>
                    <li className={"my-1"}>
                        <strong>Samaritans </strong>
                        - To talk about anything that is upsetting you, you can contact Samaritans 24 hours a day, 365
                        days a year. You can call <strong>116 123 (free from any phone)</strong>, email
                        jo@samaritans.org or visit some
                        branches in person. You can also call the Samaritans Welsh Language Line on 0808 164 0123
                        (7pm–11pm every day).
                    </li>
                    <li className={"my-1"}>
                        <strong>SANEline </strong>
                        - If you're experiencing a mental health problem or supporting someone else, you can
                        call SANEline on <strong>0300 304 7000</strong>(4.30pm–10.30pm every day).
                    </li>
                    <li className={"my-1"}>
                        <strong>Employee Assistance Program </strong>
                        - If you need support in your personal or professional life, there are confidential counseling
                        services available to you 24/7.
                        To find contact information in your region, type 'resilience' into your GS Digital Assistant App
                    </li>
                    <li className={"my-1"}>
                        <strong>NHS 111 </strong>
                        - If you're experiencing a non-urgent medical issue, calling <strong>111</strong> can give you
                        more information
                        on how to treat your problem without the need to visit a GP
                    </li>
                </ul>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default HelpModal