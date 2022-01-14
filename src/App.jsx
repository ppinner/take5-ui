import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Login from './Login';
import Home from './Home';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                {/*<Route path="/profile" element={<Profile/>}/>*/}
                <Route path="/home" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

// const routes = {
//     "/home": () => <Home />,
//     // "/profile": () => <Profile />,
//     "/": () => <Login />
// };
//
// function App() {
//     const routeResult = useRoutes(routes);
//     return routeResult
// // }
//
// export default App;
