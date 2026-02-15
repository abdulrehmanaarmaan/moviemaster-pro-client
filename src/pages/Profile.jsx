import React, { use } from 'react';
import toast from 'react-hot-toast';
import useLoader from '../hooks/useLoader';
import { AuthContext } from '../contexts/AuthContext';
import { useState } from 'react';
import axios from 'axios';

const Profile = () => {

    const { startLoading, stopLoading } = useLoader()

    const { user, setUser, updateUser, axiosPublic } = use(AuthContext);

    const [error, setError] = useState('');

    const handleUpdateProfile = async event => {

        startLoading()

        event.preventDefault()

        const userName = event.target.userName.value;
        const profileImage = event.target.profileImage.files[0];

        if (userName === '') {
            setError('Name is required.')

            stopLoading()

            return;
        }

        let imageURL;

        if (profileImage) {

            const form = new FormData();
            form.append('image', profileImage)

            const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

            await axios.post(image_API_URL, form)
                .then(res => {
                    console.log(res?.data)

                    imageURL = res?.data?.data?.display_url;
                }
                )
                .catch(err => {
                    console.log(err)
                    stopLoading()
                    toast.error('Failed to update')
                })
        }

        let updatedUser;

        if (profileImage) {
            updatedUser = { ...user, displayName: userName, photoURL: imageURL }
        }

        else {
            updatedUser = { ...user, displayName: userName }
        }

        await updateUser(updatedUser)
            .then(() => {
                setUser(updatedUser)
                const { displayName, photoURL } = updatedUser;
                const updatedData = {
                    displayName: displayName,
                    photoURL: photoURL
                }
                axiosPublic.patch(`/users/${user?.email}`, updatedData)
                    .then(res => {
                        console.log(res?.data)
                        stopLoading()
                        if (res?.data?.modifiedCount !== 0) {
                            toast.success('Updated successfully')
                        }
                        else {
                            toast.error('No changes in update')
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        stopLoading()
                        toast.error('No changes in update')
                    })
            })
            .catch(err => {
                console.log(err)
                stopLoading()
                toast.error('Failed to update')
            })

        // console.log('data', data)
        // let profile = '';
        // if (data?.profileImage.length !== 0) {
        // const profileImg = data?.profileImage[0]
        // const form = new FormData()
        // form.append('image', profileImg)
        // const image_API_URL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;
        // axios.post(image_API_URL, form)
        // .then(res => {
        // console.log(res?.data)
        // const profileImgUrl = res?.data?.data?.display_url;
        // profile = profileImgUrl
        // const updatedUser = { ...user, displayName: data?.profileName, photoURL: profile }
        // updateUserInfo(updatedUser)
        // .then(() => {
        // setUser(updatedUser)
        // console.log('profile updated')
        // const { displayName, photoURL } = updatedUser
        // const updatedProfile = {
        // name: displayName,
        // profileImage: photoURL
        // }
        // axiosInstanceSecure.patch(`/users?email=${user?.email}`, updatedProfile)
        // .then(res => {
        // console.log(res?.data)
        // stopLoading()
        // if (res?.data?.modifiedCount !== 0) {
        // refetch()
        // toast.success('Updated successfully')
        // refetch()
        // }
        // else {
        // toast.error('No changes in update')
        // }
        // })
        // .catch(err => {
        // console.log(err)
        // stopLoading()
        // toast.error('Failed to update')
        // })
        // }
        // )
        // .catch(err => {
        // console.log(err)
        // stopLoading()
        // toast.error('Failed to update')
        // })
        // })
        // .catch(err => {
        // console.log(err)
        // stopLoading()
        // toast.error('Failed to update')
        // })
        // }
        // else {
        // profile = user?.photoURL
        // const updatedUser = {
        // ...user,
        // displayName: data?.profileName,
        // photoURL: profile, // Keep the existing photo URL
        // }
        // console.log('updated form', updatedUser)
        // updateUserInfo(updatedUser)
        // .then(() => {
        // setUser(updatedUser)
        // console.log('profile updated')
        // const { displayName, photoURL } = updatedUser
        // console.log(updatedUser, 'updated google')
        // const updatedProfile = {
        // name: displayName,
        // profileImage: photoURL
        // }
        // axiosInstanceSecure.patch(`/users?email=${user?.email}`, updatedProfile)
        // .then(res => {
        // console.log(res?.data)
        // stopLoading()
        // if (res?.data?.modifiedCount !== 0) {
        // refetch()
        // toast.success('Updated successfully')
        // refetch()
        // }
        // else {
        // toast.error('No changes in update')
        // }
        // })
        // .catch(err => {
        // console.log(err)
        // stopLoading()
        // toast.error('Failed to update')
        // })
        // }
        // )
        // .catch(err => {
        // console.log(err)
        // stopLoading()
        // toast.error('Failed to update')
        // })
        // }
    }

    return (
        <div>
            <div className="hero px-4">
                <div className="card bg-base-100 shrink-0 form w-full max-w-sm">

                    <div className="card-body gap-0">
                        <form onSubmit={handleUpdateProfile}>
                            <h1 className='text-3xl font-semibold text-gray-800 tracking-tight mb-4 text-center route-title'>My Profile</h1>
                            <fieldset className="fieldset grid-cols-1 gap-4">
                                <div>
                                    <label className="label mb-1">Email</label>
                                    <input type="email" className="input rounded-lg w-full cursor-not-allowed" readOnly
                                        defaultValue={user?.email} />
                                </div>
                                <div>
                                    <label className="label mb-1">Full Name</label>
                                    <input type="text" className="input rounded-lg w-full" defaultValue={user?.displayName} name='userName' placeholder='Full Name' required />
                                </div>
                                <div>
                                    <label className="label mb-1">Profile Photo</label>
                                    <input type="file" accept="image/*" className="file-input block rounded-lg w-full" name='profileImage' />
                                    <img src={user?.photoURL} alt="" className='w-6 h-6 rounded-full mt-3' />
                                </div>
                            </fieldset>
                            <p className='text-red-500 mt-2'>{error}</p>
                            <button className="btn bg-blue-500 mt-3 w-full text-white hover:bg-blue-400 form-btn">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;