import './Home.css';
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Container, Row, Col} from 'react-bootstrap';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

function Home() {
    const [showActivityModal, setShowActivityModal] = useState(false);

    const data = [
        {
            data: {
                mindfulness: 0.7,
                connection: 0.8,
                physicalActivity: 0.9,
                learning: 0.48,
                giving: 0.6
            },
            meta: {
                color: '#5D88BB',
                fill: '#B3CBE4'
            }
        }
    ];

    const captions = {
        // columns
        mindfulness: 'Mindfulness',
        connection: 'Connection',
        physicalActivity: 'Physical Activity',
        learning: 'Learning',
        giving: 'Giving'
    };

    return (
        <Container className="Home">
            <Row className="greeting">
                <Col xs={1}/>
                <Col>
                    <h1>Hello, Poppy</h1>
                    <text>You've tracked <strong>10</strong> activities this week. Way to go!</text>
                </Col>
                <Col xs={1}/>
            </Row>
            <Row className="mt-2">
                <Col/>
                <Col xs={6}>
                    <RadarChart captions={captions}
                                data={data}
                                size={400}
                    />
                </Col>
                <Col xs={4} className="p-3 mt-5">
                    <Row className="px-5">
                        <Button className="my-1 px-2 primaryButton" variant="primary" onClick={() => setShowActivityModal(true)}>Log an Activity</Button>
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

export default Home;
