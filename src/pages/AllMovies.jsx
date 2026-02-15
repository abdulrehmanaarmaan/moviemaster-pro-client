import React, { use, useState } from 'react';
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

    const [filteredMovies, setFilteredMovies] = useState(allMovies);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [showFilters, setShowFilters] = useState(false); // ⭐ mobile toggle

    const genres = [
        'Sci-Fi', 'Action', 'Thriller', 'Drama', 'Crime',
        'Adventure', 'Romance', 'Animation', 'Fantasy',
        'Biography', 'History'
    ];

    // ================= GENRE FILTER =================
    const handleMoviesByGenres = event => {
        startLoading();

        const genre = event.target.value;
        let updatedGenres;

        if (event.target.checked) {
            updatedGenres = [...selectedGenres, genre];
        } else {
            updatedGenres = selectedGenres.filter(g => g !== genre);
        }

        setSelectedGenres(updatedGenres);

        if (updatedGenres.length === 0) {
            setFilteredMovies(allMovies);
            stopLoading();
            toast.success('Successfully filtered');
            return;
        }

        const genreQuery = updatedGenres.join(',');

        axiosPublic.get(`/movies?genres=${genreQuery}`)
            .then(res => {
                setFilteredMovies(res?.data);
                stopLoading();
                toast.success('Successfully filtered');
            })
            .catch(error => {
                stopLoading();
                toast.error(error?.message);
            });
    };

    // ================= RATING FILTER =================
    const handleMoviesByRatings = event => {
        event.preventDefault();
        startLoading();

        const minRating = event.target.minRating.value;
        const maxRating = event.target.maxRating.value;

        axiosPublic.get(`/movies?minRating=${minRating}&&maxRating=${maxRating}`)
            .then(res => {
                setFilteredMovies(res?.data);
                event.target.reset();
                stopLoading();
                toast.success('Successfully filtered');
            })
            .catch(error => {
                stopLoading();
                toast.error(error?.message);
            });
    };

    // ================= RESET =================
    const resetAllMovies = () => {
        startLoading();

        if (filteredMovies === allMovies) {
            stopLoading();
            toast('Already reset');
            return;
        }

        setFilteredMovies(allMovies);
        setSelectedGenres([]);
        stopLoading();
        toast.success('Successfully reset');
    };

    return (
        <div className='max-w-7xl mx-auto px-4 py-10'>

            {/* Title */}
            <h1 className='text-4xl font-bold text-gray-900 text-center mb-8 exceptional-title'>
                All Movies
            </h1>

            {/* ⭐ Mobile filter toggle button */}
            <div className='lg:hidden mb-6 flex justify-center'>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='btn btn-neutral form-btn'
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className='flex flex-col lg:flex-row gap-10'>

                {/* ================= SIDEBAR ================= */}
                <aside className={`
                    lg:w-1/4
                    ${showFilters ? 'block' : 'hidden'}
                    lg:block
                `}>
                    <h2 className='mb-6 text-3xl font-semibold text-gray-800 tracking-tight route-title'>
                        Filter by Genre
                    </h2>

                    <div className='space-y-3'>
                        {genres.map(genre => (
                            <label
                                key={genre}
                                className='flex items-center justify-between form rounded-lg px-4 py-2 cursor-pointer'
                            >
                                <span className='font-medium'>{genre}</span>

                                <input
                                    type='checkbox'
                                    value={genre}
                                    onChange={handleMoviesByGenres}
                                    checked={selectedGenres.includes(genre)}
                                    className='cursor-pointer'
                                />
                            </label>
                        ))}
                    </div>
                </aside>

                {/* ================= RIGHT CONTENT ================= */}
                <main className='lg:w-3/4'>

                    {/* Rating filter */}
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 m-auto form mb-24">
                        <div className="card-body gap-0">
                            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight text-center mb-4 route-title'>Filter by Ratings</h1>
                            <form onSubmit={handleMoviesByRatings}>
                                <fieldset className="fieldset gap-0">
                                    <div>
                                        <label className="label mb-1">Minimum Rating</label>
                                        <input type="number" step='0.1' min='0' max='10' className="input w-full mb-4" placeholder="Minimum Rating"
                                            name='minRating' required />
                                    </div>
                                    <div>
                                        <label className="label mb-1">Maximum Rating</label>
                                        <input type="number" step='0.1' min='0' className='input w-full' placeholder="Maximum Rating" name='maxRating' required />
                                    </div>
                                    <button className="btn btn-neutral mt-6 form-btn">Filter</button>
                                </fieldset>
                            </form>
                            <button onClick={resetAllMovies} className="btn btn-neutral rounded-md border border-teal-600 shadow-none mt-3 bg-transparent hover:bg-teal-50 text-teal-600 hover:text-teal-700 secondary-btn">Reset All Movies</button>
                        </div>
                    </div>

                    {/* Movies */}
                    {loading ? (
                        <Loader />
                    ) : filteredMovies.length > 0 ? (
                        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {filteredMovies.map(movie => (
                                <Movie movie={movie} key={movie._id} />
                            ))}
                        </section>
                    ) : allMovies.length === 0 ? (
                        <p className='text-xl text-center font-semibold text-gray-500'>
                            No movies added yet
                        </p>
                    ) : (
                        <p className='text-xl text-center font-semibold text-gray-500'>
                            No movies match your filters
                        </p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AllMovies;
