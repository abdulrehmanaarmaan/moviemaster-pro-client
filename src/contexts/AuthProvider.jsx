import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import { app } from '../firebase/firebase.init';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from 'react';

const auth = getAuth(app)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loader, setLoader] = useState(true);



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoader(false)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    const authInfo = { user, loader };

    return <AuthContext value={authInfo}>{children}</AuthContext>
};

export default AuthProvider;