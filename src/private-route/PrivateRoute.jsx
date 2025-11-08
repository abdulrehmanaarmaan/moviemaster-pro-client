import React, { use } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {
    const { user, loader } = use(AuthContext);
    const location = useLocation();

    if (user) {
        return children
    }

    if (loader) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    return <Navigate to='' state={{ from: location }} replace></Navigate>
};

export default PrivateRoute;