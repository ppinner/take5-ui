import './Home.css';
import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Col, Container, Row} from 'react-bootstrap';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
import {goals} from "../constants";
import Recommendation from "../Recommendation";

function HomePageContent({userScore, user, activityLog, setShowModal, getEntriesForPastWeek, setShowGoalProgress}) {
    const [responseMessage, setResponseMessage] = useState("Welcome back");
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        const responseMessage = (() => {
            const numActivities = activityCount();
            let message = "";
            if (numActivities > 10)
                message += `Way to go!`;
            else if (numActivities < 3) {
                message += `Remember to add activities when you complete them!`;
            }
            return message
        });
        setResponseMessage(responseMessage);

    }, [activityLog]);

    useEffect(() => {
        if(userScore != null) {
            setGraphData([
                {
                    data: {
                        mindfulness: userScore.mindfulness,
                        connection: userScore.connection,
                        physicalActivity: userScore.physicalActivity,
                        learning: userScore.learning,
                        giving: userScore.giving
                    },
                    meta: {
                        color: '#5D88BB',
                        fill: '#B3CBE4'
                    }
                }
            ])
        }
    }, [activityLog, userScore]);

    const activityCount = () => {
        try {
            return getEntriesForPastWeek(activityLog).length
        } catch (e) {
            return 0
        }
    };

    return (
        <Container className="Home mt-3">
            <Row className="greeting">
                <Col xs={1}/>
                <Col>
                    <h1>Hello, {user ? user.name : ""}</h1>
                    <text>You've
                        tracked <strong>{activityCount()}</strong> {activityCount() === 1 ? "activity" : "activities"} this
                        week. {responseMessage}</text>
                </Col>
                <Col xs={1}/>
            </Row>
            <Row className="mt-2">
                <Col/>
                <Col xs={6}>
                    <RadarChart captions={goals}
                                data={graphData}
                                size={400}
                    />
                </Col>
                <Col xs={4} className="p-3 mt-5">
                    <Row className="px-5">
                        <Button className="my-1 px-2 primaryButton" variant="primary"
                                onClick={() => setShowModal(true)}>
                            Log an Activity
                        </Button>
                        <Button className="my-1 secondaryButton" variant="outline-secondary"
                                onClick={() => setShowGoalProgress(true)}>View Goal Progress</Button>
                    </Row>
                    <Row className="recommendationSection mt-5">
                        <h4>Recommended for you...</h4>
                        {user ?
                            <Recommendation user={user}/>
                            : 'Calculating.. check back later!'
                        }
                    </Row>
                </Col>
                <Col/>
            </Row>
        </Container>
    );
}

export default HomePageContent;
