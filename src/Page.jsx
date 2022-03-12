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
import GoalProgressModal from "./modals/GoalProgressModal";
import {Alert} from "./alert/Alert";
import {alertService} from "./alert/alert-service";

const today = new Date();
const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

const renderPageContent = (showProfile, user, setUser, setShowModal, activities, userScore, setShowGoalProgress, activityLog, setActivityLog) => {
    if (showProfile) {
        return <ProfilePageContent user={user} setUser={setUser} activityLog={activityLog} activities={activities}/>;
    } else {
        return <HomePageContent user={user} userScore={userScore} activityLog={activityLog} today={today}
                                setShowModal={setShowModal}
                                getEntriesForPastWeek={getEntriesForPastWeek}
                                setShowGoalProgress={setShowGoalProgress}/>;
    }
};

const getEntriesForPastWeek = (activityLog) => {
    const today = new Date();
    const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    return getEntriesForTimePeriod(activityLog, weekAgo, today)
};

const getEntriesForTimePeriod = (activityLog, start, end) => {
    const after = new Date(end);
    const before = new Date(start);
    let activities;

    if (activityLog != null) {
        activities = activityLog.filter(log => {
            return before <= log.date <= after
        });
    } else {
        activities = [];
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

function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showGoalProgress, setShowGoalProgress] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [editActivityLog, setEditActivityLog] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showLogActivityModal, setShowLogActivityModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [editedActivityLog, setEditedActivityLog] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); //TODO - implement loading icon
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState(null);
    const [showCreateActivityModal, setCreateActivityModal] = useState(false);
    const [userScore, setScore] = useState(null);
    const [activityLog, setActivityLog] = useState(null);

    const calculateScore = (logs, start, end) => {
        const counter = {
            connection: 0,
            mindfulness: 0,
            physicalActivity: 0,
            giving: 0,
            learning: 0
        };
        getEntriesForTimePeriod(logs, start, end).map(entry => {
            return getUpdatedScoreForActivity(user.focus, counter, entry.activity.category)
        });
        return counter;
    };

    useEffect(() => {
        if (userId != null) {
            fetch(`http://localhost:8081/api/users/${userId}`)
                .then(res => res.json())
                .then(result => {
                    let userUpdate = result;
                    setUser(userUpdate);
                    setEditedActivityLog(true);
                })
                .catch((error) => {
                    alertService.error(`Could not retrieve user details for ${userId}`);
                });
        }
    }, [userId]);

    useEffect(() => {
        if (userId != null && editedActivityLog) {
            fetch(`http://localhost:8081/api/activityLog/user/${userId}`)
                .then(res => res.json())
                .then(result => {
                    setActivityLog(result);
                    setScore(calculateScore(result, weekAgo, today));
                    setEditedActivityLog(false)
                })
                .catch((error) => {
                    if(error.statusCode / 100 === 4) {
                        alertService.error('Invalid input, please ensure all required fields are provided');
                    } else {
                        alertService.error('There was an error handling your request. Please try again later.');
                    }
                });
        }
    }, [editedActivityLog, userId]);

    useEffect(() => {
        fetch(`http://localhost:8081/api/activities`)
            .then(res => res.json())
            .then(result => setActivities(result))
            .catch((error) => {
                alertService.error('Could not retrieve activities data');
            });
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
                .catch((error) => {
                    alertService.error('Could not update score');
                })
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
                        setUserId={setUserId}
                />
                <Alert />
                {renderPageContent(showProfile, user, setUser, setShowLogActivityModal, activities, userScore, setShowGoalProgress, activityLog, setActivityLog)}

                {showHistory ?
                    <ActivityHistoryModal show={showHistory} setShowHistory={setShowHistory} activityLog={activityLog}
                                          setShowActivityModal={setShowLogActivityModal} setUser={setUser}
                                          setEditActivityLog={setEditActivityLog}
                                          setActivityLog={setActivityLog}
                                          setUpdatedActivityLog={setEditedActivityLog}/> : null}
                {showLogActivityModal ?
                    <LogActivityModal show={showLogActivityModal} setShowLogActivityModal={setShowLogActivityModal}
                                      activities={activities} userId={userId}
                                      setUser={setUser} user={user}
                                      editing={editActivityLog} setEditing={setEditActivityLog}
                                      setShowCreateActivityModal={setCreateActivityModal}
                                      setShowHistoryModal={setShowHistory} setUpdatedActivityLog={setEditedActivityLog}
                                      activityLog={activityLog} setActivityLog={setActivityLog}
                    /> : null}
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