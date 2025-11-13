import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
    return (
        <div>
            <header>
                <Navbar></Navbar>
            </header>

            <main className='py-20 min-h-screen bg-blue-50 main text-black'>
                <Outlet></Outlet>
            </main>

            <footer>
                <Footer></Footer>
            </footer>

            <Toaster />
        </div>
    );
};

export default RootLayout;