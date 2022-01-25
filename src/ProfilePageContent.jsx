import './Profile.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Col, Container, Row} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel';
import {goals} from "./constants";
import Select from 'react-select';
import moment from "moment";

const toggleEditable = (editable, setEditable) => setEditable(!editable); //TODO - actually use this

const dateFromDateString = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000Z');
};

const calculateAge = (date) => {
    return moment().diff(date, 'years', false);
};

function ProfilePageContent({user, setUser}) {
    // const [showTooltip, setShowTooltip] = useState(false);
    const [editable, setEditable] = useState(false);

    // useEffect(() => {
    //     //TODO - change page elements in response to toggle
    //     if(editable){
    //         //make button say submit
    //         //change to date select on the age field
    //         console.log("editable: ", editable);
    //         toggleEditable(editable, setEditable);
    //     }
    // }, [editable]);

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
                                <Form.Control type="text" readOnly placeholder={user.name} defaultValue={user.name}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="dobInput">
                            {/*<Form.Label column lg={4}>Date of Birth:</Form.Label>*/}
                            {/*<Col>*/}
                            {/*<Form.Control type="date" id="dobField" defaultValue={dateFromDateString(user.dob)}/>*/}
                            {/*</Col>*/}
                            <Form.Label column id="ageLabel" lg={4}>Age:</Form.Label>
                            <Col>
                                <Form.Control type="text" readOnly value={calculateAge(dateFromDateString(user.dob))}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="goalInput">
                            <Form.Label column lg={4}>Primary Goal:</Form.Label>
                            <Col>
                                <Select
                                    placeholder={user.focus}
                                    name="goals"
                                    isSearchable={ false }
                                    options={
                                        Object.keys(goals).map(function (key) {
                                            return {
                                                value: key, label: goals[key]
                                            }
                                        })
                                    }
                                    defaultValue={user.focus}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="d-flex justify-content-end" controlId="nameInput">
                            <Button variant="outline-dark"
                                    size="sm"
                                    className="w-25 mx-2"
                                    id="profileSubmitBtn"
                                    // onClick={toggleEditable(editable, setEditable)}
                                >
                                Update
                            </Button>
                        </Form.Group>
                    </Form>
                    <FormLabel className="mt-3">
                        Personality Type:
                    </FormLabel>
                    <Card className="personalityResults">
                        <Card.Body>
                            <Row>
                                {Object.entries(user.personality).map(trait => {
                                    return (
                                        <Card className="personalityTrait col">
                                            <Card.Title>{trait[0].charAt(0).toUpperCase()}</Card.Title>
                                            <Card.Text>{trait[1]}%</Card.Text>
                                        </Card>
                                    )
                                })
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                    <Button variant="link" className="personalityTestLink mb-2">Retake Personality Test</Button>
                </Col>
                <Col className="">
                    <Card className="activitySummary">
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

export default ProfilePageContent;
