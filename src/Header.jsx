import {Col, Row} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logo from './Take5FullLogoCropped.png';
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import React from "react";

function Header() {
    return (
            <Row className="App-header mt-4">
                <Col>
                    <Image src={logo} alt="Logo" className="logo"/>
                </Col>
                <Col xs={6}/>
                <Col>
                    <Row>
                        <Button as={Col} id="profileBtn" className="my-1 py-1" variant="outline-secondary">Profile</Button>
                        <DropdownButton
                            as={Col}
                            variant="outline-secondary"
                            title="Actions"
                            id="actions-dropdown"
                        >
                            <Dropdown.Item href="#">Log an Activity</Dropdown.Item>
                            <Dropdown.Item href="#">View Goal Progress</Dropdown.Item>
                            <Dropdown.Item href="#">View Activity</Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item href="#">Logout</Dropdown.Item>
                        </DropdownButton>
                    </Row>
                </Col>
            </Row>
    );
}

export default Header