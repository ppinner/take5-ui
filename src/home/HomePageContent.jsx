import './Home.css';
import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Col, Container, Row} from 'react-bootstrap';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
import {goals} from "../constants";

function HomePageContent({user, setShowModal, getEntriesForPastWeek}) {
    const [responseMessage, setResponseMessage] = useState("Welcome back");
    const [graphData, setGraphData] = useState([]);
    const [userScore, setScore] = useState(user.scores);

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

        setGraphData([
            {
                data: {
                    mindfulness: user.scores.mindfulness,
                    connection: user.scores.connection,
                    physicalActivity: user.scores.physicalActivity,
                    learning: user.scores.learning,
                    giving: user.scores.giving
                },
                meta: {
                    color: '#5D88BB',
                    fill: '#B3CBE4'
                }
            }
        ])
    }, [user]);

    useEffect(() => {
        if(user !== null && user.scores != null) {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user.scores)
            };

            fetch(`http://localhost:8081/api/users/${user.id}/score`, requestOptions)
                .then(res => res.json())
                .catch((error) => console.log(error))
        }
    }, [userScore]);

    const activityCount = () => {
        return getEntriesForPastWeek(user).length
    };

    return (
        <Container className="Home">
            <Row className="greeting">
                <Col xs={1}/>
                <Col>
                    <h1>Hello, {user.name}</h1>
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
                        <Button className="my-1 secondaryButton" variant="outline-secondary">View Goal Progress</Button>
                    </Row>
                    <Row className="recommendationSection mt-5">
                        <h4>Recommended for you...</h4>
                        <Card className="recommendationCard py-2">
                            <Card.Title>Basketball</Card.Title>
                            <Card.Text className="goals">Physical Activity, Connection</Card.Text>
                        </Card>
                    </Row>
                </Col>
                <Col/>
            </Row>
        </Container>
    );
}

export default HomePageContent;
