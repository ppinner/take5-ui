import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import {goals} from "./constants";

const ContentBasedRecommender = require('content-based-recommender');

/*
Step 1: Compare users to find similar users to current user (personality, dob)
Step 2: Of these users, analyse activity logs for most common activities
    - filter by those which are under the user's focus goal
Step 3: Output the recommendation to the user
 */

function Recommendation({user}) {
    const [recommendation, setRecommendation] = useState(null);
    const [users, setUsers] = useState(null);

    const recommender = new ContentBasedRecommender({
        minScore: 0.3,
        maxSimilarDocuments: 10
    });

    //documents = users data from db
    const getAllUsers = () => {
        fetch(`http://localhost:8081/api/users/`)
            .then(res => res.json())
            .then(result => {
                setUsers(result)
            })
            .catch((error) => console.log(error));
    };

    const trainingData = () => {
        //TODO - format data in the same as documents using userID as the id, content as certain fields
    };

    const documents = [
        {id: '1000001', content: 'Why studying javascript is fun?'},
        {id: '1000002', content: 'The trend for javascript in machine learning'},
        {id: '1000003', content: 'The most insightful stories about JavaScript'},
        {id: '1000004', content: 'Introduction to Machine Learning'},
        {id: '1000005', content: 'Machine learning and its application'},
        {id: '1000006', content: 'Python vs Javascript, which is better?'},
        {id: '1000007', content: 'How Python saved my life?'},
        {id: '1000008', content: 'The future of Bitcoin technology'},
        {id: '1000009', content: 'Is it possible to use javascript for machine learning?'}
    ];

    const getRecommendation = () => {
        recommender.train(trainingData);
        //get top 10 similar items to document 1000002
        // const similarUsers = recommender.getSimilarDocuments(user.id, 0, 10);

        const mostPopular = {
            activity: {
                name: 'Basketball',
                category: ['connection', 'physicalActivity']
            },
            count: 10
        };
        //TODO - from similar activities:
        // map to just get activities from the logs
        // filter only ones that are user focus category
        // reduce to count number of activity occurrences
        // sort descending
        // take most popular

        return mostPopular
    };

    return (
        <Card className="recommendationCard py-2">
            <Card.Title> {recommendation.activity.name} </Card.Title>
            <Card.Text className="goals">{recommendation.activity.category.map(category => {
                return goals[category]
            })
            }</Card.Text>
        </Card>
    );
}

export default Recommendation