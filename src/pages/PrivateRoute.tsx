import React from "react";
import {Navigate, Outlet} from "react-router-dom";


const PrivateRoute:React.FC = () => {
    const key = localStorage.getItem("key")
    const secret = localStorage.getItem("secret")
    console.log(key, secret)

    return (
        <div>
            {key && secret ?
                <Outlet></Outlet>
                :
                <Navigate to="/"/>

            }
        </div>
    )
}

export default PrivateRoute;
