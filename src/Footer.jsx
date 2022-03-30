import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React from "react";

function Footer({setShowPrivacy, setShowHelp, setShowSettings}) {
    return (
        <Row className="footer">
            <Button as={Col} className="footer-button align-middle" variant="outline-secondary" onClick={()=>setShowPrivacy(true)}>Privacy</Button>
            <Button as={Col} className="footer-button align-middle" variant="outline-secondary" onClick={()=>setShowSettings(true)}>Settings</Button>
            <Button as={Col} className="footer-button align-middle" variant="outline-secondary" onClick={()=>setShowHelp(true)}>Urgent Help</Button>
        </Row>
    );
}

export default Footer