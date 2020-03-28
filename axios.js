import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://covidapi.info/api/v1/'
});

export default instance;