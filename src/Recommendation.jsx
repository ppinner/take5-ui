import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import {goals} from "./constants";
import {alertService} from "./alert/alert-service";

function Recommendation({user}) {
    const [recommendation, setRecommendation] = useState(null);

    //TODO - get to use this recommendation properly from backend
    const calculateRecommendation = () => {
        const mostPopular = {
            activity: {
                name: 'Basketball',
                category: ['connection', 'physicalActivity']
            },
            count: 10
        };
        return mostPopular.activity
    };

    useEffect(() => {
        if (user != null) {
            fetch(`http://localhost:8081/api/recommender/${user.id}`)
                .then(res => res.json())
                .then(result => {
                    setRecommendation(result)
                })
                .catch((error) => {
                    console.log(error);
                    // alertService.error('Could not get recommendation at this time');
                });
        }
    }, [user]);

    return (
        <Card className="recommendationCard py-2">
            {recommendation ?
                <React.Fragment>
                    <Card.Title> {recommendation.name} </Card.Title>
                    <Card.Text className="goals"> {recommendation.category.map((category, index) => {
                        return (index ? ', ' : '') + goals[category]
                    })}
                    </Card.Text>
                </React.Fragment> :
                <Card.Text>No recommendations yet</Card.Text>
            }
        </Card>
    );
}

export default Recommendation