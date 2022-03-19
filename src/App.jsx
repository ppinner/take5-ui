import Login from "./login/Login";
import Page from "./Page";
import {BrowserRouter, Routes, Route}
    from 'react-router-dom';
import React, {useState} from "react";
import {Navigate} from "react-router";
import {PrivateRoute} from "./login/PrivateRoute";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>}/>
                <Route exact path="/home/:userId"
                       element={<PrivateRoute loggedIn={loggedIn}><Page/></PrivateRoute>}/>
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;