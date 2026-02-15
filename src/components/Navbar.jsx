import React, { use } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaFilm } from 'react-icons/fa6';
import { ThemeContext } from '../contexts/ThemeContext';

const Navbar = () => {

    const { user, logout } = use(AuthContext);

    const handleLogout = () => {
        logout()
            .then(() => {
                toast.success('Successfully logged out')
            }
            )
            .catch(error => {
                console.log(error)
            })
    }

    const { darkMode, setDarkMode } = use(ThemeContext);

    return (
        <div className="navbar bg-base-100 shadow-sm md:px-7 px-2 md:flex-row flex-col md:gap-0 gap-4 lg:justify-between md:justify-start">
            <div className="navbar-start md:justify-start justify-center lg:gap-0 gap-4 flex items-center">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <div
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-lg items-center gap-1">
                        <NavLink to='/'>Home</NavLink>

                        <NavLink to='/about'>About</NavLink>

                        <NavLink to='/help-support'>Help/Support</NavLink>

                        <NavLink to='all-movies'>All Movies</NavLink>
                    </div>
                </div>
                <Link to='/' className="flex items-center text-xl hover:opacity-80 transition-opacity gap-2 duration-200">
                    <FaFilm className='w-7 h-7 text-teal-600 web-logo'></FaFilm>
                    <span className='font-extrabold bg-linear-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent tracking-tight logo-text whitespace-nowrap'>MovieMaster Pro</span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <div className="menu menu-horizontal px-1 items-center gap-6">
                    <NavLink to='/'>Home</NavLink>

                    <NavLink to='/about'>About</NavLink>

                    <NavLink to='/help-support'>Help/Support</NavLink>

                    <NavLink to='all-movies'>All Movies</NavLink>
                </div>
            </div>
            <div className="navbar-end md:justify-end justify-center gap-4">
                {
                    user ?
                        <div className='flex items-center gap-4'>

                            <div className="dropdown dropdown-center md:dropdown-end">
                                <img referrerPolicy='no-referrer' tabIndex={0} className='rounded-full w-10 h-10 cursor-pointer object-cover' src={user?.photoURL} alt="User profile" />
                                <div tabIndex="-1" className="dropdown-content bg-base-100 rounded-box z-2 w-52 p-2 shadow-sm mt-3 menu gap-1 text-center">
                                    <NavLink to='/dashboard/analytics'>Analytics</NavLink>
                                    <NavLink to={`/dashboard/my-collection/${user?.email}`}>My Collection</NavLink>
                                    <NavLink to='/dashboard/add-movie'>Add Movie</NavLink>
                                    <NavLink to='/dashboard/My-WatchList'>My WatchList</NavLink>
                                    <NavLink to='/dashboard/profile'>Profile</NavLink>

                                    <div className='border md:border-none my-1 md:my-0'></div>

                                    <button onClick={handleLogout} className='btn w-full md:hidden block'>Logout</button>
                                </div>
                            </div>

                            <button onClick={handleLogout} className='btn md:block hidden'>Logout</button>
                        </div> :
                        <div className='flex items-center gap-4 text-sm'>
                            <NavLink to='user-login'>Login</NavLink>
                            <NavLink to='user-registration'>Register</NavLink>
                        </div>
                }

                <button onClick={() => setDarkMode(!darkMode)} className='btn btn-circle' id='theme-toggler' aria-label='Toggle theme'>{darkMode ? '☀️' : '🌙'}</button>
            </div>
        </div>
    );
};

export default Navbar;