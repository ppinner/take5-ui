import '../Page.css';
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import {goals} from "../constants";
import {Scatter} from "react-chartjs-2";
import 'chartjs-adapter-moment';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function GoalProgressModal({show, setShowProgress, user}) {
    const getDataFromScoreHistory = () => {
        const datapoints = Object.entries(user.scores)
            .filter(scoreLog => {
                return moment(scoreLog[0]) >= moment(user.focusStart)
            }).map(log => {
                return {
                    x: moment(log[0]),
                    y: log[1][user.focus]
                }
            }).sort((a, b) => {
                return a.x - b.x;
            });
        return datapoints.sort()
    };
    const [graphData, setGraphData] = useState([]);

    useEffect(()=> {
        setGraphData(getDataFromScoreHistory())
    }, [user]);

    const lineOptions = {
        scales: {
            x: {
                type: "time",
                title: {
                    display: true,
                    text: 'Date'
                },
                ticks: {
                    callback: function(value, index, ticks) {
                        return moment(value).format("MMM Do");
                    }
                },
                time: {
                    unit: "day",
                    unitStepSize: 1000,
                    displayFormats: {
                        millisecond: 'MMM DD',
                        second: 'MMM DD',
                        minute: 'MMM DD',
                        hour: 'MMM DD',
                        day: 'MMM DD',
                        week: 'MMM DD',
                        month: 'MMM DD',
                        quarter: 'MMM DD',
                        year: 'MMM DD',
                    }
                },
                min: user.focusStart
            },
            y: {
                type: "linear",
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    stepSize: 0.1
                },
                title: {
                    display: true,
                    text: 'Score'
                }
            }
        },
        events: []
    };

    const chartData = {
        labels: Object.values(graphData).map(val => {
            return moment(val.x).format("MMM Do")
        }),
        datasets: [
            {
                id: `${user.focus}`,
                label: `${goals[user.focus]}`,
                data: graphData,
                showLine: true,
                backgroundColor: "#5D88BB",
                borderColor: "#5D88BB",
                borderWidth: 2
            }
        ]
    };

    function linearRegression(y, x) {
        let lr = {};
        let n = y.length;
        let sum_x = 0;
        let sum_y = 0;
        let sum_xy = 0;
        let sum_xx = 0;
        let sum_yy = 0;

        for (let i = 0; i < y.length; i++) {
            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i] * y[i]);
            sum_xx += (x[i] * x[i]);
            sum_yy += (y[i] * y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        // lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        return lr;
    }

    const getDateReachGoal = () => {
        const x_values = [];
        const y_values = [];

        for (let i = 0; i < graphData.length; i++) {
            x_values.push(graphData[i].x - graphData[0].x);
            y_values.push(graphData[i].y);
        }

        const regression = linearRegression(x_values, y_values);
        //Y = slope * X + intercept
        const x = ((1 - regression['intercept']) / regression['slope']) + graphData[0].x;

        if(regression['slope'] > 0){
            // return `you'll max this goal on ${moment(x).format("MMM Do YYYY")}`
            return `you're on the right track - keep logging activities!`
        } else {
            return `you need to log some more related activities for this goal to improve your ${goals[user.focus]}`
        }
    };

    const goalPrediction = () => {
        if (user != null && user.scores !== null) {
            if(graphData.length === 0){
                return "No new activity logs since switching your focus! Check back after adding some."
            } else if (graphData[graphData.length - 1].y === 1) {
                return "Congratulations! You've maxed out this goal for now. It might be time to switch your focus"
            } else {
                return `Based on your current progress, ${getDateReachGoal()}`
            }
        }
    };

    const handleClose = () => {
        setShowProgress(false);
    };

    useEffect(() => {
        setGraphData(getDataFromScoreHistory)
    }, [user]);

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-90w"
            centered
        >
            <Modal.Header>
                <Modal.Title>Goal Progress</Modal.Title>
            </Modal.Header>

            <Modal.Body className="py-0">
                <div className="justify-content-center">
                    <p className="my-2">Your progress
                        with <strong>{goals[user.focus]}</strong> since starting focus on <strong>{moment(user.focusStart).format("MMM Do YYYY")}</strong>
                    </p>
                    <Scatter data={chartData} options={lineOptions}/>
                </div>
                <Row>
                    <Col className={"m-0"}>
                        <p className={"mt-2 text-justify"}>{goalPrediction()}</p>
                    </Col>
                    <Col className={"col-2 my-3 mx-1 justify-self-center"}>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

export default GoalProgressModal