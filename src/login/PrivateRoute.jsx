import React from "react";
import {Navigate} from "react-router-dom";

/*
    This file was inspired by a blog post by Robin Wieruch:
    https://www.robinwieruch.de/react-router-private-routes/#:~:text=Private%20Routes%20in%20React%20Router,page%2C%20they%20cannot%20access%20it.
 */
function PrivateRoute({loggedIn, children}) {
    return loggedIn ? children : <Navigate to={"/login"}/>;
}

export {PrivateRoute};