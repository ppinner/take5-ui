import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React from "react";

function Footer() {
    return (
        <Row className="footer">
            <Col xs={3}/>
            <Button as={Col} className="footer-button" variant="outline-secondary">Privacy</Button>
            <Button as={Col} className="footer-button" variant="outline-secondary">Settings</Button>
            <Button as={Col} className="footer-button" variant="outline-secondary">Help</Button>
            <Col xs={3}/>
        </Row>
    );
}

export default Footer