import './Page.css';
import {Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import LogActivityModal from "./modals/LogActivityModal";
import Footer from "./Footer";
import HomePageContent from "./home/HomePageContent";
import ProfilePageContent from "./ProfilePageContent";
import Login from "./login/Login";

const renderPageContent = (showProfile, user, setUser, setShowModal) => {
    if (showProfile) {
        return <ProfilePageContent user={user} setUser={setUser}/>;
    } else {
        return <HomePageContent user={user} setShowModal={setShowModal} getEntriesForPastWeek={getEntriesForPastWeek}/>;
    }
};

const getEntriesForPastWeek = (user) => {
    const today = new Date();
    const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    let weeklyActivities;

    if (user.activityLog != null) {
        weeklyActivities = user.activityLog.filter(log => {
            return weekAgo <= log.date <= today
        });
    }
    return weeklyActivities
};

const getUpdatedScoreForActivity = (focus, currentScore, goals) => {
    const score = currentScore;
    goals.map(goal => {
        if (focus === goal) {
            score[goal] += 0.2
        } else {
            score[goal] += 0.1
        }
        if (score[goal] > 1) {
            score[goal] = 1
        }
    });
    return score
};


function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); //TODO - implement loading icon
    const [error, setError] = useState(false); //TODO - implement error notifications
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState(null);
    // const [userScore, setScore] = useState({
    //     connection: 0,
    //     mindfulness: 0,
    //     physicalActivity: 0,
    //     giving: 0,
    //     learning: 0
    // });


    // const calculateInitialScore = () => {
    //     //TODO - calculate current score from this week's entries only instead of using previous DB
    //     getEntriesForPastWeek(user).map(entry => {
    //         console.log(entry, userScore)
    //         setScore(getUpdatedScoreForActivity(user.focus, userScore, entry.activity.category))
    //     });
    //     const userUpdated = user;
    //     userUpdated.scores = userScore;
    //     setUser(userUpdated);
    // };

    useEffect(() => {
        if(userId != null) {
            fetch(`http://localhost:8081/api/users/${userId}`)
                .then(res => res.json())
                .then(result => {
                    setUser(result)
                })
                .catch((error) => console.log(error))
        }
    }, [userId]);

    useEffect(() => {
        fetch(`http://localhost:8081/api/activities`)
            .then(res => res.json())
            .then(result => setActivities(result))
            .catch((error) => console.log(error));
    }, []);

    if (isLoggedIn) {
        // calculateInitialScore();
        return (
            <Container className="App">
                <Header showProfile={showProfile}
                        setShowProfile={setShowProfile}
                        setIsLoggedIn={setIsLoggedIn}
                        setShowModal={setShowModal}/>
                {renderPageContent(showProfile, user, setUser, setShowModal, getEntriesForPastWeek)}

                <LogActivityModal show={showModal} setShowModal={setShowModal} activities={activities} userId={userId}
                                  setUser={setUser} user={user} getUpdatedScore={getUpdatedScoreForActivity}/>

                <Footer/>
            </Container>
        );
    }
    return <Login setIsLoggedIn={setIsLoggedIn} userId={userId} setUserId={setUserId} setUser={setUser}/>;
}

export default Page