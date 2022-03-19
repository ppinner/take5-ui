import React from "react";
import {Navigate} from "react-router-dom";

function PrivateRoute({loggedIn, children}) {
    return loggedIn ? children : <Navigate to={"/login"}/>;
}

export {PrivateRoute};