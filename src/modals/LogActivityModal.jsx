import '../Page.css';
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";
import Select from 'react-select';
import {goals} from "../constants";
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import PropTypes from "prop-types";

const emoticons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon/>,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon/>,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon/>,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon/>,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon/>,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const {value, ...other} = props;
    return <span {...other}>{emoticons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};


function LogActivityModal({show, setShowModal, activities, userId, setUser, user, getUpdatedScore}) {
    const [showError, setShowError] = useState(false); //TODO - implement error handling
    const [rating, setRating] = useState(0);
    const [activity, setActivity] = useState(null);
    const [activityGoals, setActivityGoals] = useState([]);  //format [ 0: "Activity", 1: "Connection" ]
    const [reflection, setReflection] = useState("");

    const handleClose = () => {
        setActivityGoals([]); //to ensure select clears
        setShowModal(false);
    };

    const selectActivity = (selected) => {
        //TODO - error checking on this?
        const chosenActivity = activities.find(activity => {
            return activity.id === selected.value
        });
        setActivity(chosenActivity)
        setActivityGoals(chosenActivity.category)
    };

    const selectActivityGoals = (selected) => {
        const newOptions = selected.map(option => {
            return option.value
        });
        setActivityGoals(newOptions)
    };

    const submitActivity = () => {
        const activityLog = {
            "activity": {
                "id": activity.id,
                "name": activity.name,
                "description": activity.description,
                "category": activityGoals
            },
            "reflection": reflection.target.value || "",
            "rating": rating ? rating : 0,
            "date": new Date(),
            "id": "fakeId"
        };

        if (activityLog.activity != null && activityLog.activity.name != null) {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(activityLog)
            };

            fetch(`http://localhost:8081/api/users/${userId}/activityLog/add`, requestOptions)
                .then(async res => {
                    const data = await res.json();

                    if (!res.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || res.status;
                        return Promise.reject(error);
                    }
                    data.scores = getUpdatedScore(user, user.scores, activityGoals);
                    setUser(data);
                    handleClose();
                })
                .catch(error => {
                    setShowError(true);
                    console.log(error)
                });
        } else {
            console.log("error in input - please provide an activity name");
        }
    };

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-80w"
            centered
        >
            <link rel="stylesheet" href="bootstrap-multiselect.css" type="text/css"/>
            <Modal.Header>
                <Modal.Title>Log an Activity</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="personalInfo">
                    <Form.Group className="mb-3 align-items-center" controlId="activityInput">
                        <Col>
                            <Select
                                placeholder={"Activity Name"}
                                name="activity"
                                options={
                                    Object.values(activities).map(function (activity) {
                                        return {
                                            value: activity.id, label: activity.name
                                        }
                                    })}
                                onChange={event => {
                                    selectActivity(event);
                                }}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 align-items-center" controlId="goalInput">
                        <Col>
                            <Select
                                placeholder={"Associated goal(s)"}
                                isMulti
                                name="goals"
                                options={
                                    Object.keys(goals).map(function (key) {
                                        return {
                                            value: key, label: goals[key]
                                        }
                                    })}
                                value={
                                    activityGoals.map(function (key) {
                                        return {
                                            value: key, label: goals[key]
                                        }
                                    })}
                                onChange={(event) => {
                                    selectActivityGoals(event);
                                }}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 mt-3 align-items-center" controlId="reflection">
                        <Form.Label>Reflection:</Form.Label>
                        <Form.Text className="mx-3">(Optional)</Form.Text>
                        <Form.Control as="textarea"
                                      onChange={event => {
                                          setReflection(event);
                                      }}
                                      rows={3} placeholder='Any memorable moments? Personal wins?'/>
                    </Form.Group>
                    <Form.Group as={Col} className="d-flex align-content-center">
                        <Form.Label>Rating:</Form.Label>
                        <Rating
                            className="mx-3"
                            name="activityRating"
                            size="large"
                            emptyIcon={null}
                            IconContainerComponent={IconContainer}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            highlightSelectedOnly
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={() => submitActivity(userId)}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LogActivityModal