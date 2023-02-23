import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.interceptors.response.use(
    response => response.data,
    error => {
      if (error.response.status === 401) {
        window.location.href = '/';
      } else if (error.response.status === 403) {
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
        axios.defaults.headers.common['Authorization'] = null;
      }
      return error.response.data
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

reportWebVitals();
