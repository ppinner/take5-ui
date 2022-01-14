import './Profile.css';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Container, Row, Col} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
import FormLabel from 'react-bootstrap/FormLabel';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function Profile() {
    // const [showTooltip, setShowTooltip] = useState(false);
    //
    // const personalityTraits = {
    //     // columns
    //     Extroversion: 'Extroversion',
    //     Neuroticism: 'Neuroticism',
    //     Agreeableness: 'Agreeableness',
    //     Conscientiousness: 'Conscientiousness',
    //     Openness: 'Openness'
    // };
    //
    // const PersonalityTrait = () => (
    //     <OverlayTrigger trigger="click" placement="right" overlay={tooltip}>
    //         <Card className="personalityTrait col" onClick={{() => setShow(!show)}}>
    //             <Card.Title>46%</Card.Title>
    //             <Card.Text>E</Card.Text>
    //         </Card>
    //     </OverlayTrigger>
    // );


    return (
        <Container className="Profile">
            <Row>
                <Col xs={1}/>
                <Col>
                    <h1>Your Profile</h1>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col xs={1}/>
                <Col>
                    <Form className="personalInfo">
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="nameInput">
                            <Form.Label column lg={4}>Name:</Form.Label>
                            <Col>
                                <Form.Control type="text" placeholder='Name'/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="dobInput">
                            <Form.Label column lg={4}>Date of Birth:</Form.Label>
                            <Col>
                                <Form.Control type="date" placeholder=' '/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="goalInput">
                            <Form.Label column lg={4}>Primary Goal:</Form.Label>
                            <Col>
                                <InputGroup>
                                    <Form.Control type="text" placeholder='Select a Goal'/>
                                    <DropdownButton
                                        variant="outline-secondary"
                                        id="goalDropdown"
                                        align="end"
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
                    </Form>
                    <FormLabel className="mt-4">
                        Personality Type:
                    </FormLabel>
                    <Card className="personalityResults">
                        <Card.Body>
                            <Row>
                                <Card className="personalityTrait col">
                                    <Card.Title>E</Card.Title>
                                    <Card.Text>46%</Card.Text>
                                </Card>
                                <Card className="personalityTrait col">
                                    <Card.Title>N</Card.Title>
                                    <Card.Text>25%</Card.Text>
                                </Card>
                                <Card className="personalityTrait col">
                                    <Card.Title>A</Card.Title>
                                    <Card.Text>10%</Card.Text>
                                </Card>
                                <Card className="personalityTrait col">
                                    <Card.Title>C</Card.Title>
                                    <Card.Text>94%</Card.Text>
                                </Card>
                                <Card className="personalityTrait col">
                                    <Card.Title>O</Card.Title>
                                    <Card.Text>84%</Card.Text>
                                </Card>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Button variant="link" className="personalityTestLink">Retake Personality Test</Button>
                </Col>
                <Col className="">
                    <Card className="activitySummary mb-4">
                        <Card.Title className="mx-2 mt-2">Your Activity Summary</Card.Title>
                        <Card.Body className="summaryGrid">
                            <Row>
                                <Card className="summaryStat col">
                                    <Card.Title>Most Popular Activity:</Card.Title>
                                    <Card.Text>French Lessons</Card.Text>
                                </Card>
                                <Card className="summaryStat col">
                                    <Card.Title>Most Popular Goal:</Card.Title>
                                    <Card.Text>Learning</Card.Text>
                                </Card>
                            </Row>
                            <Row>
                                <Card className="summaryStat col">
                                    <Card.Title>Most Improved Goal:</Card.Title>
                                    <Card.Text>Learning</Card.Text>
                                </Card>
                                <Card className="summaryStat col">
                                    <Card.Title>Least Engaged Goal:</Card.Title>
                                    <Card.Text>Giving</Card.Text>
                                </Card>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={1}/>
            </Row>
        </Container>
    );
}

export default Profile;
