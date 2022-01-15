import './Page.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import {Container} from "react-bootstrap";
import React, { useState } from "react";
import Header from "./Header";
import LogActivityModal from "./modals/LogActivityModal";
import Footer from "./Footer";
import HomePageContent from "./home/HomePageContent";
import ProfilePageContent from "./ProfilePageContent";
import Login from "./login/Login";

function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false); //TODO - implement this, not working?

    const renderPageContent = () => {
        if (showProfile) {
            return <ProfilePageContent />;
        } else {
            return <HomePageContent />;
        }
    };

    if (isLoggedIn) {
        return (
            <Container className="App">
                <Header showProfile={showProfile}
                        setShowProfile={setShowProfile}
                        setIsLoggedIn={setIsLoggedIn}
                        setShowModal={setShowModal}/>
                {renderPageContent()}

                <LogActivityModal show={showModal}/>

                <Footer/>
            </Container>
        );
    }
    return <Login setIsLoggedIn={setIsLoggedIn}/>;


}

export default Page