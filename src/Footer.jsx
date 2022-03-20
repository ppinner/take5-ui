import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React from "react";

function Footer({setShowPrivacy, setShowHelp, setShowSettings}) {
    return (
        <Row className="footer d-flex">
            <Button as={Col} className="footer-button" variant="outline-secondary" onClick={()=>setShowPrivacy(true)}>Privacy</Button>
            <Button as={Col} className="footer-button" variant="outline-secondary" onClick={()=>setShowSettings(true)}>Settings</Button>
            <Button as={Col} className="footer-button" variant="outline-secondary" onClick={()=>setShowHelp(true)}>Urgent Help</Button>
        </Row>
    );
}

export default Footer