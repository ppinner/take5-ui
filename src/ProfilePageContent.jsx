import Select from 'react-select';
import './Profile.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Col, Container, Row} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel';
import {goals, personalityTraitDesc, personalityTraits} from "./constants";
import Popover from 'react-bootstrap/Popover';
import moment from "moment";
import PersonalityTestModal from "./modals/PersonalityTestModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {alertService} from "./alert/alert-service";
import InvalidInputError from "./InvalidInputError.js";

const toggleEditable = (editable, setEditable) => setEditable(!editable);

export const dateFromDateString = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
};

export const dateForPicker = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DD')
};

const calculateAge = (date) => {
    return moment().diff(date, 'years', false);
};

function ProfilePageContent({user, setUser, activityLog, activities}) {
    const [editable, setEditable] = useState(false);
    const [takePersonalityTest, setTakePersonalityTest] = useState(false);
    const [name, setName] = useState(user.name);
    const [dob, setDob] = useState(user.dob);
    const [goal, setGoal] = useState(user.focus);
    const [originalValues, setOriginalValues] = useState({
        name: user.name,
        dob: user.dob,
        goal: user.focus
    });
    const [goalChanged, setGoalChanged] = useState(false);
    const [mostPopularGoal, setMostPopularGoal] = useState();
    const [mostPopularActivity, setMostPopularActivity] = useState();
    const [leastEngagedGoal, setLeastEngagedGoal] = useState();
    const [mostImprovedGoal, setMostImprovedGoal] = useState();
    const today = new Date();
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); //TODO - duplicated, move to utils

    const saveChanges = () => {
        try {
            const updatedUser = user;
            if (name != undefined)
                updatedUser.name = name;
            if (dob != NaN)
                updatedUser.dob = dateFromDateString(dob);
            updatedUser.focus = goal;

            if (goalChanged) {
                updatedUser.focusStart = today;
            }

            if (updatedUser.dob === "Invalid date") {
                throw new InvalidInputError("Invalid date input");
            }

            setUser(updatedUser);
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedUser)
            };

            fetch(`http://localhost:8081/api/users/${user.id}`, requestOptions)
                .then(res => {
                    return res.json()
                })
                .catch((error) => {
                    if (error.statusCode / 100 === 4) {
                        alertService.error('Invalid input, please ensure all required fields are provided');
                    } else {
                        alertService.error('There was an error handling your request. Please try again later.');
                    }
                });

            toggleEditable(editable, setEditable);
        } catch(e) {
            alertService.error('There was an error with values input. Please ensure they are correct');
        }
    };

    useEffect(() => {
        if (user != null && activityLog != null) {
            let activityCounts = {};
            let goalCounts = {};
            for (let i = 0; i < activityLog.length; i++) {
                if (activityLog[i].activity.id != null) {
                    const activity = activityLog[i].activity;
                    activityCounts[activity.id] = (activityCounts[activity.id] || 0) + 1;
                    activity.category.map((goal) => {
                        goalCounts[goal] = (goalCounts[goal] || 0) + 1;
                    })
                }
            }

            if (Object.keys(activityCounts).length > 0 && activities.length > 0) {
                setMostPopularActivity(() => {
                    try {
                        const mostPopularId = Object.keys(activityCounts).reduce((max, key) => {
                            return ((max === undefined) || activityCounts[key] > activityCounts[max]) ? +key : max
                        });
                        return (activities.find((activity) => activity.id === mostPopularId).name) ? (activities.find((activity) => activity.id === mostPopularId).name) : null;
                    } catch {
                        return null
                    }
                });

                setMostPopularGoal(() => {
                    try {
                        const mostPopularGoal = Object.keys(goalCounts).reduce((max, key) => {
                            return (max === undefined || goalCounts[key] > goalCounts[max]) ? +key : max
                        });
                        return goals[mostPopularGoal];
                    } catch {
                        return null
                    }
                });

                setLeastEngagedGoal(() => {
                    try {
                        Object.keys(goals).map((goal) => {
                            if (goalCounts[goal] === undefined)
                                goalCounts[goal] = 0;
                        });

                        const leastPopularGoal = Object.keys(goals).reduce((min, key) => {
                            return (min === undefined || goalCounts[key] < goalCounts[min]) ? key : min
                        });
                        return goals[leastPopularGoal];
                    } catch {
                        return null
                    }
                });

                setMostImprovedGoal(() => {
                    try {
                        let diffs = {
                            connection: 0,
                            mindfulness: 0,
                            learning: 0,
                            giving: 0,
                            physicalActivity: 0
                        };
                        let lastMonthScores = Object.entries(user.scores).filter((scoreLog) => {
                            return moment(scoreLog[0]) >= moment(monthAgo)
                        }).sort((a, b) => {
                            return moment(a[0]) - moment(b[0]);
                        })[0];

                        Object.keys(goals).map(goal => {
                            diffs[goal] = Math.abs(user.scores[dateFromDateString(new Date())][goal] - lastMonthScores[1][goal])
                        });

                        const mostImprovedGoal = Object.keys(goals).reduce((max, key) => {
                            return (max === undefined || diffs[key] > diffs[max]) ? +key : max
                        });
                        return goals[mostImprovedGoal]
                    } catch (e) {
                        console.log(e);
                        return null
                    }
                })
            }
        }
    }, [activityLog]);


    const popover = ((trait) => {
        return <Popover>
            <Popover.Header as="h3">{personalityTraits[trait]}</Popover.Header>
            <Popover.Body>
                {personalityTraitDesc[trait]}
            </Popover.Body>
        </Popover>
    });

    return (
        <Container className="Profile mt-3">
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
                                <Form.Control type="text" readOnly={!editable}
                                              onChange={(e) => setName(e.target.value)}
                                              placeholder={user.name}
                                              defaultValue={name}/>
                            </Col>
                        </Form.Group>

                        {editable ?
                            <Form.Group as={Row} className="mb-3 align-items-center" controlId="dobInput">
                                <Form.Label column lg={4}>Date of Birth:</Form.Label>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        value={dob ? dateForPicker(dob) : ''}
                                        onfocus={dateForPicker(dob)}
                                        placeholder={dob ? dateForPicker(dob) : "dd/mm/yyyy"}
                                        onChange={(e) => setDob(dateFromDateString(e.target.value))}
                                    />
                                </Col>
                            </Form.Group>
                            :
                            <Form.Group as={Row} className="mb-3 align-items-center" controlId="ageDisplay">
                                <Form.Label column id="ageLabel" lg={4}>Age:</Form.Label>
                                <Col>
                                    <Form.Control type="text" readOnly
                                                  value={calculateAge(dateFromDateString(user.dob))}/>
                                </Col>
                            </Form.Group>
                        }

                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="goalInput">
                            <Form.Label column lg={4}>Primary Goal:</Form.Label>
                            <Col>
                                <Select
                                    placeholder={goals[user.focus]}
                                    name="goals"
                                    isSearchable={false}
                                    options={
                                        Object.keys(goals).map(function (key) {
                                            return {
                                                value: key, label: goals[key]
                                            }
                                        })
                                    }
                                    className="goalSelect"
                                    isDisabled={!editable}
                                    defaultValue={user.focus}
                                    onChange={(e) => {
                                        setGoalChanged(true);
                                        setGoal(e.value)
                                    }}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="d-flex justify-content-end" controlId="nameInput">
                            <Button variant="outline-dark"
                                    size="sm"
                                    className="w-25 mx-2"
                                    id="profileSubmitBtn"
                                    onClick={editable ? saveChanges : () => toggleEditable(editable, setEditable)}
                            >
                                {editable ? "Save" : "Update"}
                            </Button>
                        </Form.Group>
                    </Form>
                    <FormLabel className="mt-3">
                        Personality Type:
                    </FormLabel>
                    <Card className="personalityResults">
                        <Card.Body>
                            <Row>
                                {user.personality ?
                                    Object.entries(user.personality).map(trait => {
                                        return (
                                            <OverlayTrigger
                                                trigger={['hover', 'focus']}
                                                key={trait}
                                                placement="top"
                                                overlay={popover(trait[0])}
                                            >
                                                <Card className="personalityTrait col">
                                                    <Card.Title
                                                        className="personalityTrait_title">{trait[0].charAt(0).toUpperCase()}</Card.Title>
                                                    <Card.Text>{trait[1]}</Card.Text>
                                                </Card>
                                            </OverlayTrigger>
                                        )
                                    }) : "Take the personality quiz by clicking the link below"
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                    <Button variant="link" className="personalityTestLink mb-2"
                            onClick={() => setTakePersonalityTest(true)}>
                        {user.personality ? "Retake Personality Test" : "Take Personality Test"}</Button>
                </Col>
                <Col className="">
                    <Card className="activitySummary">
                        <Card.Title className="mx-2 mt-2">Your Activity Summary</Card.Title>
                        <Card.Body className="summaryGrid">
                            <Row>
                                <Card className="summaryStat col">
                                    <Card.Title>Most Popular Activity:</Card.Title>
                                    <Card.Text>{mostPopularActivity ? mostPopularActivity : "..."}</Card.Text>
                                </Card>
                                <Card className="summaryStat col">
                                    <Card.Title>Most Popular Goal:</Card.Title>
                                    <Card.Text>{mostPopularGoal ? mostPopularGoal : "..."}</Card.Text>
                                </Card>
                            </Row>
                            <Row>
                                <Card className="summaryStat col">
                                    <Card.Title>Most Improved this Month:</Card.Title>
                                    <Card.Text>{mostImprovedGoal ? mostImprovedGoal : "..."}</Card.Text>
                                </Card>
                                <Card className="summaryStat col">
                                    <Card.Title>Least Engaged Goal:</Card.Title>
                                    <Card.Text>{leastEngagedGoal ? leastEngagedGoal : "..."}</Card.Text>
                                </Card>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={1}/>
            </Row>
            <PersonalityTestModal takePersonalityTest={takePersonalityTest}
                                  setTakePersonalityTest={setTakePersonalityTest} user={user} setUser={setUser}>
            </PersonalityTestModal>
        </Container>
    );
}

export default ProfilePageContent;
