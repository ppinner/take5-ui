import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React from "react";

function Footer({setShowPrivacy, setShowHelp}) {
    return (
        <Row className="footer">
            <Col xs={3}/>
            <Button as={Col} className="footer-button" variant="outline-secondary" onClick={()=>setShowPrivacy(true)}>Privacy</Button>
            <Button as={Col} className="footer-button" variant="outline-secondary" disabled>Settings</Button>
            <Button as={Col} className="footer-button" variant="outline-secondary" onClick={()=>setShowHelp(true)}>Urgent Help</Button>
            <Col xs={3}/>
        </Row>
    );
}

export default Footer