import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';

type PrivateRoutePropType ={
    children: JSX.Element 
}

const PrivateRoute = ({children,...rest}: PrivateRoutePropType):JSX.Element  => {
    const {user,isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading.................. auth user</div>
    }
    
    if (!user.user_id ) {
        return    <Navigate to="/login" state={{from:location}}></Navigate>
    }
    
    return children;
};

export default PrivateRoute;