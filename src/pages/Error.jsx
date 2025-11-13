import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Error = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='py-20 text-center min-h-screen font-bold main'>
                <h1 className='text-7xl md:text-8xl text-blue-700 mb-[30px] error'>404</h1>

                <p className='mb-4 text-4xl md:text-6xl'>Oops, page not found!</p>

                <p>The page you are looking for is not available.</p>
            </div>
            <Footer></Footer>

        </div >
    );
};

export default Error;