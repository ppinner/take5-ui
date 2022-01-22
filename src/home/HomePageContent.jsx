import './Home.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Container, Row, Col} from 'react-bootstrap';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
import {goals} from "../constants";

function HomePageContent({user}) {
    const responseMessage = (() => {
        const numActivities = activityCount();
        let message = "";
        if(numActivities > 10)
            message += `Way to go!`;
        else if(numActivities < 3){
            message += `Remember to add activities when you complete them!`;
        }
        return message
    });


    const data = [
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
    ];

    const activityCount = () => {
        const today = new Date();
        const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
        let weeklyActivities;

        if(user.activityLog != null) {
             weeklyActivities = user.activityLog.filter(log => {
                return weekAgo <= log.date <= today
            });
        }
        return weeklyActivities.length
    };

    return (
        <Container className="Home">
            <Row className="greeting">
                <Col xs={1}/>
                <Col>
                    <h1>Hello, {user.name}</h1>
                    <text>You've tracked <strong>{activityCount()}</strong> {activityCount() === 1 ? "activity" : "activities"} this week. {responseMessage()}</text>
                </Col>
                <Col xs={1}/>
            </Row>
            <Row className="mt-2">
                <Col/>
                <Col xs={6}>
                    <RadarChart captions={goals}
                                data={data}
                                size={400}
                    />
                </Col>
                <Col xs={4} className="p-3 mt-5">
                    <Row className="px-5">
                        <Button className="my-1 px-2 primaryButton" variant="primary">
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
