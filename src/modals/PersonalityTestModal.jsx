import '../Page.css';
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Slider from '@mui/material/Slider';
import {BigFiveQuestions} from "./BigFiveQuestions";
import Col from "react-bootstrap/Col";
import withStyles from "@mui/styles/withStyles/withStyles";
import {personalityTraitDesc, personalityTraits} from "../constants";

function PersonalityTestModal({takePersonalityTest, setTakePersonalityTest, user, setUser}) {
    const [showError, setShowError] = useState(false); //TODO - implement error handling
    const [answers, setAnswers] = useState(new Array(50).fill(3));
    const [currentPage, setCurrentPage] = useState(0);
    const [bounds, setBounds] = useState({start: 0, end: 5});
    const [formComplete, setFormComplete] = useState(false);

    useEffect(() => {
        if (currentPage !== 0) {
            let start = (currentPage - 1) * 5;
            setBounds({start: start, end: start + 5});
        }
    }, [currentPage]);

    const handleClose = () => {
        resetTestModal();
        setTakePersonalityTest(false);
        //TODO - show error popup when try to do this
    };

    const goBack = () => {
        let page;
        if (currentPage <= 1)
            page = 0;
        else {
            page = currentPage - 1
        }

        setCurrentPage(page)
    };

    const goForward = () => {
        let page;
        if (currentPage >= 9) {
            page = 10;
            setFormComplete(true);
        } else {
            page = currentPage + 1
        }
        setCurrentPage(page)
    };

    const resetTestModal = () => {
        setAnswers(new Array(50).fill(3));
        setCurrentPage(0);
        setFormComplete(false);
    };

    const marks = [
        {
            value: 1,
            label: 'Disagree',
        },
        {
            value: 2,
            label: 'Slightly Disagree',
        },
        {
            value: 3,
            label: 'Neutral',
        },
        {
            value: 4,
            label: 'Slightly Agree',
        },
        {
            value: 5,
            label: 'Agree',
        },
    ];

    const NoTrackSlider = withStyles({
        track: {
            display: "none"
        },
        markActive: {
            backgroundColor: "currentColor"
        }
    })(Slider);

    const calculatePersonalityScores = () => {
        let result =
            {
                "openness": 0,
                "conscientiousness": 0,
                "extroversion": 0,
                "agreeableness": 0,
                "neuroticism": 0
            };

        //E = 20 + (1) ___ - (6) ___ + (11) ___ - (16) ___ + (21) ___ - (26) ___ + (31) ___ - (36) ___ + (41) ___ - (46) ___ = _____
        result.extroversion = 20 + answers[0] - answers[5] + answers[10] - answers[15] + answers[20] - answers[25] + answers[30] - answers[35] + answers[40] - answers[45];

        //A = 14 - (2) ___ + (7) ___ - (12) ___ + (17) ___ - (22) ___ + (27) ___ - (32) ___ + (37) ___ + (42) ___ + (47) ___ = _____
        result.agreeableness = 14 - answers[1] + answers[6] - answers[11] + answers[16] - answers[21] + answers[26] - answers[31] + answers[36] + answers[41] + answers[46];

        //C = 14 + (3) ___ - (8) ___ + (13) ___ - (18) ___ + (23) ___ - (28) ___ + (33) ___ - (38) ___ + (43) ___ + (48) ___ = _____
        result.conscientiousness = 14 + answers[2] - answers[7] + answers[12] - answers[17] + answers[22] - answers[27] + answers[32] - answers[37] + answers[42] + answers[47];

        //N = 38 - (4) ___ + (9) ___ - (14) ___ + (19) ___ - (24) ___ - (29) ___ - (34) ___ - (39) ___ - (44) ___ - (49) ___ = _____
        result.neuroticism = 38 - answers[3] + answers[8] - answers[13] + answers[18] - answers[23] - answers[28] - answers[33] - answers[38] - answers[43] - answers[48];

        //O = 8 + (5) ___ - (10) ___ + (15) ___ - (20) ___ + (25) ___ - (30) ___ + (35) ___ + (40) ___ + (45) ___ + (50) ___ = _____
        result.openness = 8 + answers[4] - answers[9] + answers[14] - answers[19] + answers[24] - answers[29] + answers[34] + answers[39] + answers[44] + answers[49];

        return result
    };

    const updateAnswer = (answer, index) => {
        let newAnswers = answers;
        newAnswers[index] = answer;
        setAnswers(newAnswers)
    };

    const submitTest = () => {
        const scores = calculatePersonalityScores();

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(scores)
        };

        fetch(`http://localhost:8081/api/users/${user.id}/personality`, requestOptions)
            .then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || res.status;
                    return Promise.reject(error);
                }
                setUser(data);
                handleClose();
            })
            .catch(error => {
                setShowError(true);
                console.log(error)
            });
        resetTestModal();
    };

    return (
        <Modal
            show={takePersonalityTest}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-90w"
            centered
        >
            <Modal.Header>
                <Modal.Title>The Big Five Personality Test</Modal.Title>
            </Modal.Header>
            {
                currentPage === 0 ?
                    <Modal.Body>
                        <p>This is an evidence-based personality test; it will help you understand why you act the way
                            that you do and how your personality is structured.</p>
                        <p>There are 50 questions and it will take 10-15minutes to complete</p>
                        <p>The test calculates a score out of 40 for the following personality traits:</p>
                        {
                            Object.entries(personalityTraitDesc).map((trait) => {
                                return <p><strong>{personalityTraits[trait[0]]}:</strong> {trait[1]}</p>
                            })
                        }
                    </Modal.Body>
                    :
                    <Modal.Body>
                        <h5>
                            Complete the phrases. I ...
                        </h5>
                        <Form className="personalityTest">
                            {
                                BigFiveQuestions.slice(bounds.start, bounds.end).map((question, index) => {
                                    return <Form.Group className="d-flex align-content-center">
                                        <Col>
                                            <Form.Label>{bounds.start + index + 1}. {question}</Form.Label>
                                            <div className="mx-5 mb-3 justify-content-center">
                                                <NoTrackSlider
                                                    marks={marks}
                                                    min={1}
                                                    max={5}
                                                    step={null}
                                                    defaultValue={answers[index]}
                                                    valueLabelDisplay="auto"
                                                    onChangeCommitted={(e, val) => updateAnswer(val, index)}
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                })
                            }
                        </Form>
                    </Modal.Body>
            }
            <Modal.Footer>
                <Col className="justify-content-start">
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button className="mx-1" variant="outline-secondary" onClick={goBack}>Back</Button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <p class="align-self-center my-1">Page {currentPage} of 10</p>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button className="mx-1" variant="outline-primary" onClick={goForward}>{currentPage === 0 ? "Start" : "Next"}</Button>
                    <Button variant="primary" onClick={submitTest} disabled={!formComplete}>Submit</Button>
                </Col>
            </Modal.Footer>
        </Modal>
    )
}

export default PersonalityTestModal