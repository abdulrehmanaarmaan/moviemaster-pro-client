import React, { use } from 'react';
import star from '../assets/star.png'
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import useLoader from '../hooks/useLoader';
import Loader from './Loader';

const MovieToWatch = ({ movies, setMovies, movieToWatch }) => {
    const { loading, startLoading, stopLoading } = useLoader();

    const { _id, posterUrl, title, releaseYear, rating, duration } = movieToWatch;

    const { axiosPublic } = use(AuthContext);

    const handleRemoveMovie = () => {
        startLoading()

        axiosPublic.delete(`/WatchList/${_id}`)
            .then(res => {
                stopLoading()
                const remainingMovies = movies.filter(movie => movie._id !== _id);
                setMovies(remainingMovies)
                toast.success('Successfully removed from your WatchList')
                console.log(res)
            })
            .catch(error => {
                stopLoading()
                toast.error(error.message)
                console.log(error)
            })
    }

    if (loading) return <Loader></Loader>

    return (
        <div className='max-w-[1440px] rounded-sm p-4 flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between justify-normal items-center bg-white mx-auto movie'>
            <aside className='flex flex-col md:flex-row items-center gap-4 max-w-full w-full md:max-w-fit md:w-fit'>
                <img className='max-w-full w-full md:max-w-20 md:w-20 max-h-[1%] md:max-h-20 md:h-20 rounded-lg' src={posterUrl} alt="" />

                <div className='space-y-4 text-center md:text-left max-w-full w-full md:w-fit md:max-w-fit'>
                    <h1 className='font-bold text-xl'>{title}</h1>

                    <div className='flex justify-between md:justify-normal gap-0 md:gap-4 items-center font-bold max-w-full w-full md:max-w-fit md:w-fit'>
                        <h1>{releaseYear}</h1>

                        <div className='flex items-center gap-1'>
                            <span className='max-w-4 max-h-4'>
                                <img className='w-full h-full' src={star} alt="" />
                            </span>

                            <h1 className='text-yellow-500'>{rating}</h1>
                        </div>

                        <h1>{duration} min</h1>
                    </div>
                </div>
            </aside>

            <button onClick={() => document.getElementById('my_modal_5').showModal()} className='text-white py-3 rounded-sm bg-red-400 max-w-full w-full md:max-w-[100px] md:w-[100px] hover:cursor-pointer font-bold sensitive-btn '>Remove</button>

            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <p className="py-4 font-bold text-xl">Are you sure that you want to remove this movie from your WatchList?</p>
                    <div className="modal-action">
                        <form method="dialog" className='space-x-4'>
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Cancel</button>
                            <button onClick={handleRemoveMovie} className='btn'>Remove</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MovieToWatch;