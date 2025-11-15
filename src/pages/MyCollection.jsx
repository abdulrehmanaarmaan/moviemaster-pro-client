import React, { use, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import AddedMovie from '../components/AddedMovie';
import useLoader from '../hooks/useLoader';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/Loader';

const MyCollection = () => {
    const addedMovies = useLoaderData();

    const [newMovies, setNewMovies] = useState(addedMovies);

    const { loading, startLoading, stopLoading } = useLoader();

    const { axiosPublic, user } = use(AuthContext);

    useEffect(() => {
        startLoading()
        axiosPublic.get(`/movies?email=${user.email}`)
            .then(res => {
                stopLoading()
                console.log(res)
            })
            .catch(error => {
                stopLoading()
                console.log(error)
            })
    }, [axiosPublic, user.email])

    if (loading) return <Loader></Loader>

    else {
        return (
            <div>
                <h1 className='font-bold text-[48px] mb-10 text-center'>My Collection</h1>

                {newMovies.length === 0 ? <p className='text-3xl text-center font-bold'>No movies present here.</p> : <section className='space-y-6 md:space-y-4 px-4'>
                    {
                        newMovies.map(addedMovie => <AddedMovie setNewMovies={setNewMovies} newMovies={newMovies} addedMovie={addedMovie} key={addedMovie._id}></AddedMovie>)
                    }
                </section>}
            </div>
        );
    }
};

export default MyCollection;