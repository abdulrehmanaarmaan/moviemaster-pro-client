import axios from 'axios';
import React from 'react';

const axiosInstancePublic = axios.create({
    baseURL: 'https://assignment-10-server-rho-ebon.vercel.app/'
})

const useAxiosPublic = () => {
    return axiosInstancePublic
};

export default useAxiosPublic;