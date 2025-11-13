import React, { use, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { NavLink, useLocation, useNavigate } from 'react-router';
import useLoader from '../hooks/useLoader';


const UserRegistration = () => {
    const { loading, startLoading, stopLoading } = useLoader();

    const { axiosPublic, googleLogin, setUser, register, loginToast, updateUser } = use(AuthContext);

    const [error, setError] = useState('');

    const location = useLocation();

    const navigate = useNavigate();

    const registorErrorMessage = 'The email you provided is already in use.';

    const handleRegister = event => {
        startLoading()
        event.preventDefault()

        // const name = event.target.name.value;
        const name = event.target.name.value;
        const email = event.target.email.value;
        const photo = event.target.photo.value;
        const password = event.target.password.value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (!passwordRegex.test(password)) {
            setError('Your password must contain at least six characters, including at least one uppercase and one lowercase letter.')
            return;
        }

        register(email, password)
            .then(res => {
                stopLoading()
                updateUser({ ...res.user, photoURL: photo })
                    .then(() => {
                        setUser({ ...res.user, photoURL: photo })
                    })
                    .catch(error => {
                        console.log(error)
                    })

                toast.success('Successfully registered')
                navigate(location?.state?.from?.pathname || '/')
                console.log(res.user)

                const newUser = {
                    displayName: name,
                    email: email,
                    photoURL: photo
                }

                axiosPublic.post('/users', newUser)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                stopLoading()
                toast.error(registorErrorMessage)
                setError(registorErrorMessage)
                console.log(error)
            })
    }

    const handleGoogleLogin = () => {
        startLoading()
        googleLogin()
            .then(res => {
                stopLoading()
                setUser(res.user)
                toast.success(loginToast)
                navigate(location?.state?.from?.pathname || '/')
                console.log(res.user)

                const newUser = {
                    displayName: res.user.displayName,
                    email: res.user.email,
                    photoURL: res.user.photoURL
                }

                axiosPublic.post('/users', newUser)
                    .then(res => {
                        console.log(res.data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                stopLoading()
                toast.error(error.message)
                setError(error.message)
                console.log(error)
            })
    }

    if (loading) return <Loader></Loader>;

    return (
        <div className='px-4'>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl m-auto form">
                <div className="card-body">
                    <h1 className='text-center text-5xl font-bold mb-4'>Register</h1>
                    <form onSubmit={handleRegister}>
                        <fieldset className="fieldset">
                            <label className="label">Name</label>
                            <input type="text" className="inpu max-w-full w-full" placeholder="Name" name='name' required />
                            <label className="label">Email</label>
                            <input type="email" className="input max-w-full w-full" placeholder="Email" name='email' required />
                            <label className="label">Photo URL</label>
                            <input type="text" className="input max-w-full w-full" placeholder="Photo URL" name='photo' required />
                            <label className="label">Password</label>
                            <input type="password" className="input max-w-full w-full" placeholder="Password" name='password' required />
                            <button className="btn btn-neutral mt-4">Register</button>
                        </fieldset>
                    </form>
                    <button onClick={handleGoogleLogin} className="btn bg-white text-black border-[#e5e5e5]">
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                        Login with Google
                    </button>

                    <p className='text-center'>Already have an account? <NavLink to='/user-login' className='hover:cursor-pointer hover:text-blue-700 hover:font-bold hover:underline navigate'>Login</NavLink></p>
                </div>

                {error && <p className='text-center text-red-700 max-w-[90%] mx-auto mb-6'>{error}</p>}
            </div>
        </div >
    );
};

export default UserRegistration;