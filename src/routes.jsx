import React from "react";
import Home from "./Home";
// import Profile from "./Profile";
import Login from "./Login";

const routes = {
    "/": () => <Login />,
    "/home": () => <Home />,
    // "/profile": () => <Profile />
};
export default routes;