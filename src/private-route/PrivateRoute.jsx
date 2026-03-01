import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router';
import Loader from '../components/Loader';

const PrivateRoute = ({ children }) => {
    const { user, loader } = use(AuthContext);
    const location = useLocation();

    if (user) {
        return children
    }

    if (loader) {
        return <Loader></Loader>
    }

    return <Navigate state={location.pathname} to='/user-login' replace={false}></Navigate >
};

export default PrivateRoute;