import './Page.css';
import {Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Header from "./Header";
import LogActivityModal from "./modals/LogActivityModal";
import Footer from "./Footer";
import HomePageContent from "./home/HomePageContent";
import ProfilePageContent from "./ProfilePageContent";
import PrivacyModal from "./modals/PrivacyModal";
import HelpModal from "./modals/HelpModal";
import ActivityHistoryModal from "./modals/ActivityHistoryModal";
import CreateActivityModal from "./modals/CreateActivityModal";
import GoalProgressModal from "./modals/GoalProgressModal";
import {Alert} from "./alert/Alert";
import {alertService} from "./alert/alert-service";
import {useNavigate, useParams} from "react-router-dom";
import SettingsModal from "./modals/SettingsModal";

const today = new Date();
const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

const renderPageContent = (showProfile, user, setUser, setShowModal, activities, userScore, setShowGoalProgress, activityLog, setActivityLog, recommendation) => {
    if (showProfile) {
        return <ProfilePageContent user={user} setUser={setUser} activityLog={activityLog} activities={activities}/>;
    } else {
        return <HomePageContent user={user} userScore={userScore} activityLog={activityLog} today={today}
                                setShowModal={setShowModal}
                                getEntriesForPastWeek={getEntriesForPastWeek}
                                setShowGoalProgress={setShowGoalProgress}
                                recommendation={recommendation}/>;
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
    let params = useParams();
    const [userId, setUserId] = useState(params.userId.substring(1));
    let navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showGoalProgress, setShowGoalProgress] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [editActivityLog, setEditActivityLog] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showLogActivityModal, setShowLogActivityModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [editedActivityLog, setEditedActivityLog] = useState(false);
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState(null);
    const [showCreateActivityModal, setCreateActivityModal] = useState(false);
    const [userScore, setScore] = useState(null);
    const [activityLog, setActivityLog] = useState(null);
    const [recommendation, setRecommendation] = useState(null);

    const calculateScore = (focus, logs, start, end) => {
        const counter = {
            connection: 0,
            mindfulness: 0,
            physicalActivity: 0,
            giving: 0,
            learning: 0
        };
        getEntriesForTimePeriod(logs, start, end).map(entry => {
            return getUpdatedScoreForActivity(focus, counter, entry.activity.category)
        });
        return counter;
    };

    useEffect(() => {
        if(userId != null) {
            console.log("searching for " + userId);
            fetch(`http://localhost:8081/api/users/${userId}`)
                .then(res => res.json())
                .then(result => setUser(result))
                .catch((error) => {
                    if(error.statusCode / 100 === 4) {
                        alertService.error('Invalid input, please ensure all required fields are provided');
                    } else {
                        alertService.error('There was an error finding the user details. Please try again later.');
                    }
                });
        }
    }, []);

    useEffect(() => {
        if(user != null) {
            fetch(`http://localhost:8081/api/activityLog/user/${userId}`)
                .then(res => res.json())
                .then(result => {
                    setActivityLog(result);
                    if (user != null) {
                        setScore(calculateScore(user.focus, result, weekAgo, today));
                    }
                })
                .catch((error) => {
                    alertService.error("There was an error updating the activity log. We'll try again later!");
                });

            fetch(`http://localhost:1234/recommender/user/${userId}`)
                .then(res => res.json())
                .then(result => {
                    setRecommendation(result)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [user]);

    useEffect(() => {
        if (editedActivityLog && user != null) {
            fetch(`http://localhost:8081/api/users/${userId}`)
                .then(res => res.json())
                .then(result => setUser(result))
                .catch((error) => {
                    if(error.statusCode / 100 === 4) {
                        alertService.error('Invalid input, please ensure all required fields are provided');
                    } else {
                        alertService.error('There was an error finding the user details. Please try again later.');
                    }
                });

            fetch(`http://localhost:8081/api/activityLog/user/${userId}`)
                .then(res => res.json())
                .then(result => {
                    setActivityLog(result);
                    setScore(calculateScore(user.focus, result, weekAgo, today));
                    setEditedActivityLog(false)
                })
                .catch((error) => {
                    if (error.statusCode === 404) {
                        alertService.error('Invalid input, please ensure all required fields are provided');
                    } else {
                        alertService.error('There was an error updating the activity log. Please try again later.');
                    }
                });
        }
    }, [editedActivityLog, user]);

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

    return (
        <Container className="App">
            <Header showProfile={showProfile}
                    setShowProfile={setShowProfile}
                    setShowModal={setShowLogActivityModal}
                    setShowHistory={setShowHistory}
                    setShowGoalProgress={setShowGoalProgress}
                    navigate={navigate}
            />
            <Alert/>
            {renderPageContent(showProfile, user, setUser, setShowLogActivityModal, activities, userScore, setShowGoalProgress, activityLog, setActivityLog, recommendation)}

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
            {showSettings ? <SettingsModal show={showSettings} setShowSettings={setShowSettings}/> : null}
            {showHelp ? <HelpModal show={showHelp} setShowHelp={setShowHelp}/> : null}
            {showGoalProgress ? <GoalProgressModal show={showGoalProgress} setShowProgress={setShowGoalProgress}
                                                   user={user}/> : null}
            <Footer setShowPrivacy={setShowPrivacy} setShowHelp={setShowHelp} setShowSettings={setShowSettings}/>
        </Container>
    );
}

export default Page