import './Page.css';
import {Container} from "react-bootstrap";
import React, {useState, useEffect, useRef} from "react";
import Header from "./Header";
import LogActivityModal from "./modals/LogActivityModal";
import Footer from "./Footer";
import HomePageContent from "./home/HomePageContent";
import ProfilePageContent from "./ProfilePageContent";
import Login from "./login/Login";


const getActivities = (setActivities) => {
    fetch(`http://localhost:8081/api/activities`)
        .then(res => res.json())
        .then(result => setActivities(result))
        .catch((error) => console.log(error));
};

const renderPageContent = (showProfile, user, setUser) => {
    if (showProfile) {
        return <ProfilePageContent user={user} setUser={setUser}/>;
    } else {
        return <HomePageContent user={user}/>;
    }
};

function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false); //TODO - implement this, not working?
    const [isLoaded, setIsLoaded] = useState(false); //TODO - implement loading icon
    const [error, setError] = useState(false); //TODO - implement error notifications
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState(null);

    if (isLoggedIn) {
        getActivities(setActivities);
        return (
            <Container className="App">
                <Header showProfile={showProfile}
                        setShowProfile={setShowProfile}
                        setIsLoggedIn={setIsLoggedIn}
                        setShowModal={setShowModal}/>
                {renderPageContent(showProfile, user, setUser)}

                <LogActivityModal show={showModal} setShowModal={setShowModal} activities={activities}/>

                <Footer/>
            </Container>
        );
    }
    return <Login setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} setUser={setUser}/>;
}

export default Page