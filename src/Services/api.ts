


import axios from 'axios';
import { Data } from '../types';

export const fetchActivityData = async (): Promise<Data> => {
  try {
    const response = await axios.get('/activity.json'); // Corrected URL
    console.log(response);
    if (response.status !== 200) {
      throw new Error('Failed to fetch data');
    }
    const data = response.data.data;  
    console.log('Fetched data:', data); // Log the fetched data
    

    if (!data || !data.AuthorWorklog) {
      throw new Error('AuthorWorkLog not found in the fetched data');
    }

    const authorWorkLog = data.AuthorWorklog;
    console.log('AuthorWorkLog properties:', Object.keys(authorWorkLog));

    return data as Data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


