import React, { use, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import MovieToWatch from '../components/MovieToWatch';
import useLoader from '../hooks/useLoader';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../components/Loader';

const MyWatchList = () => {
    const moviesToWatch = useLoaderData();

    const [movies, setMovies] = useState(moviesToWatch);

    const { axiosPublic } = use(AuthContext);

    const { loading, startLoading, stopLoading } = useLoader();

    useEffect(() => {
        startLoading()
        axiosPublic.get('/movies/WatchList')
            .then(res => {
                stopLoading()
                console.log(res)
            })
            .catch(error => {
                stopLoading()
                console.log(error)
            })
    }, [axiosPublic])

    if (loading) return <Loader></Loader>

    else {
        return (
            <div>
                <h1 className='font-bold text-[48px] mb-10 text-center'>My WatchList</h1>

                {movies.length === 0 ? <p className='text-3xl text-center font-bold'>No movies present here.</p> : <section className='space-y-6 md:space-y-4 px-4'>
                    {
                        movies.map(movieToWatch => <MovieToWatch movies={movies} setMovies={setMovies} movieToWatch={movieToWatch} key={movieToWatch._id}></MovieToWatch>)
                    }
                </section>}
            </div>
        );
    }
};

export default MyWatchList;