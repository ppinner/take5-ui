import '../Page.css';
import Button from "react-bootstrap/Button";
import React from "react";
import Modal from "react-bootstrap/Modal";

function PrivacyModal({show, setShowPrivacy}) {
    const handleClose = () => {
        setShowPrivacy(false);
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
                <Modal.Title>Take5 Privacy Policy</Modal.Title>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Header>

            <Modal.Body>
                We currently collect and process the following information:
                <ul>
                    <li>Personal identifiers, contacts and characteristics (for example, name and contact details)</li>
                </ul>
                <p>
                    The personal information we process is provided to us directly by you to create your account and
                    provide a tailored experience including personalisation and activity recommendations
                    We use the information that you have given us to create a user profile to input into a
                    recommendation algorithm to suggest activities for you based on other users similar to you.
                    We may share this information with Queen Mary University of London
                </p>
                <p>
                    You are able to remove your consent at any time. You can do this by contacting Poppy Pinner
                </p>
                <h3 className="my-1">Contact details</h3>
                <p>
                    <p>Name: Poppy Pinner</p>
                    <p>Address: Mile End Rd, Bethnal Green, London E1 4NS</p>
                    <p>Phone Number: 0207 882 5005</p>
                    <p>E-mail: ec18525@qmul.ac.uk</p>
                </p>

            </Modal.Body>

            <Modal.Footer>
                <a href='/take5-ui/src/Privacy Policy.pdf' download>Click to read the full policy</a>
            </Modal.Footer>
        </Modal>
    );
}

export default PrivacyModal