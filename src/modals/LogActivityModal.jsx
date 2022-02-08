import '../Page.css';
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import {goals, emoticons} from "../constants";
import Rating from '@mui/material/Rating';
import PropTypes from "prop-types";
import {dateForPicker, dateFromDateString} from "../ProfilePageContent";

function IconContainer(props) {
    const {value, ...other} = props;
    return <span {...other}>{emoticons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};

function LogActivityModal({show, setShowLogActivityModal, activities, userId, setUser, user, getUpdatedScore, editing,
                              setEditing, setShowCreateActivityModal, setShowHistoryModal}) {
    const [showError, setShowError] = useState(false); //TODO - implement error handling
    const [rating, setRating] = useState(0);
    const [activity, setActivity] = useState(null);
    const [activityGoals, setActivityGoals] = useState([]);  //format [ 0: "Activity", 1: "Connection" ]
    const [reflection, setReflection] = useState("");
    const [date, setDate] = useState(new Date());

    const handleClose = () => {
        setShowLogActivityModal(false);
        if(editing != null) {
            setShowHistoryModal(true);
            setEditing(null);
        }
        clearModal();
    };

    const clearModal = () => {
        setActivityGoals([]); //to ensure select clears
        setReflection("");
        setRating(0);
        setActivity(null);
        setDate(new Date())
    };

    const selectActivity = (selected) => {
        //TODO - error checking on this?
        const chosenActivity = activities.find(activity => {
            return activity.id === selected.value
        });
        setActivity(chosenActivity);
        setActivityGoals(chosenActivity.category)
    };

    const selectActivityGoals = (selected) => {
        const newOptions = selected.map(option => {
            return option.value
        });
        setActivityGoals(newOptions)
    };

    useEffect(() => {
        if (editing != null) {
            setRating(editing.rating);
            setActivity(editing.activity);
            setActivityGoals(editing.activity.category);
            setReflection(editing.reflection);
            setDate(dateForPicker(editing.date));
        } else {
            clearModal();
        }
    }, [editing]);

    const submitActivity = () => {
        const activityLog = {
            "activity": {
                "id": activity.id,
                "name": activity.name,
                "description": activity.description,
                "category": activityGoals
            },
            "reflection": reflection || "",
            "rating": rating ? rating : 0,
            "date": date ? date : new Date(),
            "id": editing ? editing.id : null
        };

        if (activityLog.activity != null && activityLog.activity.name != null) {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(activityLog)
            };

            fetch(`http://localhost:8081/api/users/${userId}/activityLog/edit`, requestOptions)
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
            clearModal();
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
                    <Modal.Title>{editing != null ? "Edit Activity Log" : "Log an Activity"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form className="personalInfo">
                        <Form.Group className="mb-3 align-items-center" controlId="activityInput">
                            <Col>
                                <Creatable
                                    placeholder={"Activity Name"}
                                    name="activity"
                                    options={
                                        Object.values(activities).map(function (activity) {
                                            return {
                                                value: activity.id, label: activity.name
                                            }
                                        })
                                    }
                                    onChange={event => {
                                        if (event.__isNew__) {
                                            setShowLogActivityModal(false);
                                            setShowCreateActivityModal(true);
                                        } else {
                                            selectActivity(event);
                                        }
                                    }}
                                    value={activity ? {
                                        value: activity.id, label: activity.name
                                    } : null}
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
                        <Form.Group>
                            <Col>
                                <Form.Control type="date" id="dateField"
                                              defaultValue={dateForPicker(date)}
                                              onfocus={dateForPicker(date)}
                                              onChange={(e) => setDate(dateFromDateString(e.target.value))}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group className="mb-3 mt-3 align-items-center" controlId="reflection">
                            <Form.Label>Reflection:</Form.Label>
                            <Form.Text className="mx-3">(Optional)</Form.Text>
                            <Form.Control as="textarea"
                                          onChange={event => {
                                              setReflection(event.target.value);
                                          }}
                                          value={reflection ? reflection : ""}
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
                                value={rating ? rating : 0}
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