import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Login from './login/Login';
import HomePageContent from './home/HomePageContent';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                {/*<Route path="/profile" element={<ProfilePageContent/>}/>*/}
                <Route path="/home" element={<HomePageContent/>}/>
            </Routes>
        </BrowserRouter>
    );
}

// const routes = {
//     "/home": () => <HomePageContent />,
//     // "/profile": () => <ProfilePageContent />,
//     "/": () => <Login />
// };
//
// function App() {
//     const routeResult = useRoutes(routes);
//     return routeResult
// // }
//
// export default App;
