import React, { use, useEffect, useState } from 'react';
import Movie from '../components/Movie';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import useLoader from '../hooks/useLoader';
import Loader from '../components/Loader';
import { useLoaderData } from 'react-router';

const AllMovies = () => {
    const { loading, startLoading, stopLoading } = useLoader();

    const { axiosPublic } = use(AuthContext);

    const allMovies = useLoaderData();

    useEffect(() => {
        startLoading()
        axiosPublic.get('/movies')
            .then(res => {
                stopLoading()
                console.log(res)
            })
            .catch(error => {
                console.log(error)
            })
    }, [axiosPublic])

    const [filteredMovies, setFilteredMovies] = useState(allMovies);

    const [selectedGenres, setSelectedGenres] = useState([]);

    const genres = ['Sci-Fi', 'Action', 'Thriller', 'Drama', 'Crime', 'Adventure', 'Romance', 'Animation', 'Fantasy', 'Biography', 'History'];

    const handleMoviesByGenres = event => {
        startLoading()


        const genre = event.target.value;

        let updatedGenres;

        if (event.target.checked) {
            updatedGenres = [...selectedGenres, genre];
            toast.success('Successfully filtered')
        }

        else {
            updatedGenres = selectedGenres.filter(g => g !== genre);
            toast.success('Successfully filtered')
        }
        setSelectedGenres(updatedGenres)

        if (updatedGenres.length === 0) {
            setFilteredMovies(allMovies);
            return;
        }

        const genreQuery = updatedGenres.join(',');

        axiosPublic.get(`/movies?genres=${genreQuery}`)
            .then(res => {
                stopLoading()
                setFilteredMovies(res.data)
                console.log(res)
            })
            .catch(error => {
                stopLoading()
                toast.error(error.message)
                console.log(error)
            })
    }

    const handleMoviesByRatings = event => {
        startLoading()

        event.preventDefault();

        const min_rating = event.target.min_rating.value;
        const max_rating = event.target.max_rating.value;

        axiosPublic.get(`/movies?minRating=${min_rating}&&maxRating=${max_rating}`)
            .then(res => {
                stopLoading()
                setFilteredMovies(res.data)
                toast.success('Successfully filtered')
                event.target.reset()
                console.log(res.data)
            })
            .catch(error => {
                stopLoading()
                toast.error(error.message)
                console.log(error)
            })
    }

    const resetAllMovies = () => {
        startLoading()
        if (filteredMovies === allMovies) {
            stopLoading()
            toast.error('All of the movies already exist here')
        }

        else {
            stopLoading()
            setFilteredMovies(allMovies)
            toast.success('Successfully reset')
            setSelectedGenres([])
        }
    }

    if (loading) return <Loader></Loader>

    return (
        <div>
            <h1 className='font-bold text-[48px] text-center mb-10'>All Movies</h1>

            <section className='gap-6 max-w-[1320px] mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 px-4'>
                {
                    filteredMovies.map(movie => <Movie movie={movie} key={movie._id}></Movie>)
                }
            </section>

            <div className='my-30'>
                <h1 className='text-center text-4xl font-bold mb-10'>Filter By Genre</h1>

                <div className='flex flex-wrap items-center mx-0 lg:mx-auto max-w-fit justify-between md:justify-center gap-10 px-4'>
                    {genres.map(genre => <div key={genre} className='flex items-center gap-2'>
                        <h1 className='font-bold'>{genre}</h1>
                        <input className='hover: cursor-pointer' onChange={handleMoviesByGenres} type='checkbox' readOnly defaultValue={genre} checked={selectedGenres.includes(genre)}></input>
                    </div>)}
                </div>
            </div>

            <div className='px-4'>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl m-auto form">
                    <div className="card-body">
                        <h1 className='text-center text-4xl font-bold mb-4 md:leading-normal leading-11'>Filter By Ratings</h1>
                        <form onSubmit={handleMoviesByRatings}>
                            <fieldset className="fieldset">
                                <label className="label">Minimum Rating</label>
                                <input type="text" pattern='^\d+\.\d{1,2}$' title='Type only a decimal number.' className="input max-w-full w-full" placeholder="Minimum Rating" name='min_rating' required />
                                <label className="label">Maximum Rating</label>
                                <input type="text" pattern='^\d+\.\d{1,2}$' title='Type only a decimal number.' className='input max-w-full w-full' placeholder="Maximum Rating" name='max_rating' required />
                                <button className="btn btn-neutral mt-8">Filter</button>
                            </fieldset>
                        </form>
                        <button onClick={resetAllMovies} className="btn btn-neutral">Reset All Movies</button>
                    </div>
                </div>
            </div>

        </div >
    );
};


export default AllMovies;