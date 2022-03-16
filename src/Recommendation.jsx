import React from "react";
import Card from "react-bootstrap/Card";
import {goals} from "./constants";

function Recommendation({recommendation}) {
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