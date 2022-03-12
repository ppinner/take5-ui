import '../Page.css';
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";
import Select from 'react-select';
import {goals } from "../constants";
import {alertService} from "../alert/alert-service";

function CreateActivityModal({show, setShowCreateActivityModal, activities, setActivities, setShowActivityLogModal}) {
    const [showError, setShowError] = useState(false); //TODO - implement error handling
    const [activityName, setActivityName] = useState("");
    const [activityGoals, setActivityGoals] = useState([]);  //format [ 0: "Activity", 1: "Connection" ]
    const [description, setDescription] = useState("");

    const handleClose = () => {
        clearModal();
        setShowCreateActivityModal(false);
        setShowActivityLogModal(true);
    };

    const clearModal = () => {
        setActivityGoals([]); //to ensure select clears
        setDescription("");
        setActivityName("");
    };

    const selectActivityGoals = (selected) => {
        const newOptions = selected.map(option => {
            return option.value
        });
        setActivityGoals(newOptions)
    };

    const submitActivity = () => {
        const activity = {
            "name": activityName,
            "description": description,
            "category": activityGoals
        };

        if (activity.name != null && activity.category != null && activity.description != null) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(activity)
            };

            fetch(`http://localhost:8081/api/activities`, requestOptions)
                .then(async res => {
                    const data = await res.json();

                    if (!res.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || res.status;
                        return Promise.reject(error);
                    }
                    let updatedActivitiesList = [];
                    activities.forEach((activity) => {
                        updatedActivitiesList.push(activity)
                    });
                    updatedActivitiesList.push(data);
                    setActivities(updatedActivitiesList);
                    handleClose();
                })
                .catch(error => {
                    alertService.error('Could not retrieve activities');
                });
            handleClose();
        } else {
            alertService.error('Invalid input - please ensure name, description and categories are provided');
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
                <Modal.Title>Add an Activity</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="personalInfo">
                    <Form.Group className="mb-3 align-items-center" controlId="activityInput">
                        <Col>
                            <Form.Control
                                placeholder={"Activity Name"}
                                name="activity"
                                onChange={event => {
                                    setActivityName(event.target.value);
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
                    <Form.Group className="mb-3 mt-3 align-items-center" controlId="description">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control as="textarea"
                                      onChange={event => {
                                          setDescription(event.target.value);
                                      }}
                                      rows={3}/>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={() => submitActivity()}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateActivityModal