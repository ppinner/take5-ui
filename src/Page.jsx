import './Page.css';
import {Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import LogActivityModal from "./modals/LogActivityModal";
import Footer from "./Footer";
import HomePageContent from "./home/HomePageContent";
import ProfilePageContent from "./ProfilePageContent";
import Login from "./login/Login";
import PrivacyModal from "./modals/PrivacyModal";
import HelpModal from "./modals/HelpModal";
import ActivityHistoryModal from "./modals/ActivityHistoryModal";
import CreateActivityModal from "./modals/CreateActivityModal";
import moment from "moment";
import GoalProgressModal from "./modals/GoalProgressModal";

const today = new Date();
const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

const renderPageContent = (showProfile, user, setUser, setShowModal, activities, userScore, setShowGoalProgress) => {
    if (showProfile) {
        return <ProfilePageContent user={user} setUser={setUser} activities={activities}/>;
    } else {
        return <HomePageContent user={user} userScore={userScore} today={today} setShowModal={setShowModal}
                                getEntriesForPastWeek={getEntriesForPastWeek} setShowGoalProgress={setShowGoalProgress}/>;
    }
};

const getEntriesForPastWeek = (user) => {
    const today = new Date();
    const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    return getEntriesForTimePeriod(user, today, weekAgo)
};

const getEntriesForTimePeriod = (user, start, end) => {
    const today = new Date(start);
    const weekAgo = new Date(end);
    let activities;

    if (user != null && user.activityLog != null) {
        activities = user.activityLog.filter(log => {
            return weekAgo <= log.date <= today
        });
    }

    return activities
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

const startScores = {
    connection: 0,
    mindfulness: 0,
    physicalActivity: 0,
    giving: 0,
    learning: 0
};

function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showGoalProgress, setShowGoalProgress] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [editActivityLog, setEditActivityLog] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showLogActivityModal, setShowLogActivityModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); //TODO - implement loading icon
    const [error, setError] = useState(false); //TODO - implement error notifications
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState(null);
    const [showCreateActivityModal, setCreateActivityModal] = useState(false);
    const [userScore, setScore] = useState(startScores);

    const calculateScore = (start, end) => {
        const counter = {
            connection: 0,
            mindfulness: 0,
            physicalActivity: 0,
            giving: 0,
            learning: 0
        };
        getEntriesForTimePeriod(user, start, end).map(entry => {
            getUpdatedScoreForActivity(user.focus, counter, entry.activity.category)
        });
        setScore(counter);
        return counter;
    };

    useEffect(() => {
        if (userId != null ) {
            fetch(`http://localhost:8081/api/users/${userId}`)
                .then(res => res.json())
                .then(result => {
                    let userUpdate = result;
                    const score = calculateScore(today, weekAgo);
                    const scoreKey = moment(today).format('YYYY-MM-DDT00:00:00.000+00:00');
                    userUpdate.scores[scoreKey] = score;
                    setUser(userUpdate)
                })
                .catch((error) => console.log(error));
        }
    }, [userId]);

    useEffect(() => {
        if(!isLoggedIn && userId != null)
            setIsLoggedIn(true)
    }, [userId]);

    useEffect(() => {
        fetch(`http://localhost:8081/api/activities`)
            .then(res => res.json())
            .then(result => setActivities(result))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (user !== null && userScore != null) {
            const requestOptions = {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    date: today,
                    score: userScore
                })
            };

            fetch(`http://localhost:8081/api/users/${user.id}/score`, requestOptions)
                .then(res => res.json())
                .catch((error) => console.log(error))
        }
    }, [userScore]);

    if (isLoggedIn) {
        return (
            <Container className="App">
                <Header showProfile={showProfile}
                        setShowProfile={setShowProfile}
                        setIsLoggedIn={setIsLoggedIn}
                        setShowModal={setShowLogActivityModal}
                        setShowHistory={setShowHistory}
                        setShowGoalProgress={setShowGoalProgress}
                />
                {renderPageContent(showProfile, user, setUser, setShowLogActivityModal, activities, userScore, setShowGoalProgress)}

                {showHistory ? <ActivityHistoryModal show={showHistory} setShowHistory={setShowHistory} user={user}
                                                     setShowActivityModal={setShowLogActivityModal} setUser={setUser}
                                                     setEditActivityLog={setEditActivityLog}
                                                     calculateScore={() => calculateScore(today, weekAgo)}/> : null}
                {showLogActivityModal ?
                    <LogActivityModal show={showLogActivityModal} setShowLogActivityModal={setShowLogActivityModal}
                                      activities={activities} userId={userId}
                                      setUser={setUser} user={user}
                                      calculateScore={() => calculateScore(today, weekAgo)}
                                      editing={editActivityLog} setEditing={setEditActivityLog}
                                      setShowCreateActivityModal={setCreateActivityModal}
                                      setShowHistoryModal={setShowHistory}/> : null}
                {showCreateActivityModal ? <CreateActivityModal show={showCreateActivityModal}
                                                                setShowCreateActivityModal={setCreateActivityModal}
                                                                activities={activities} setActivities={setActivities}
                                                                setShowActivityLogModal={setShowLogActivityModal}/> : null}
                {showPrivacy ? <PrivacyModal show={showPrivacy} setShowPrivacy={setShowPrivacy}/> : null}
                {showHelp ? <HelpModal show={showHelp} setShowHelp={setShowHelp}/> : null}
                {showGoalProgress ? <GoalProgressModal show={showGoalProgress} setShowProgress={setShowGoalProgress}
                                                       user={user}/> : null}
                <Footer setShowPrivacy={setShowPrivacy} setShowHelp={setShowHelp}/>
            </Container>
        );
    }
    return <Login setIsLoggedIn={setIsLoggedIn} userId={userId} setUserId={setUserId} setUser={setUser}/>;
}

export default Page