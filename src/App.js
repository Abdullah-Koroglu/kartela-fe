import React from "react";
import Router from "./Routes";
import axios from 'axios';
import { StateProvider } from "./utils/context/StateContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
axios.defaults.headers.common['Authorization'] = localStorage.getItem ('jwt') ? `Bearer ${localStorage.getItem ('jwt')}` : null;

export default function App() {
  return (
    <>
      <StateProvider>
        <Router />
        <ToastContainer position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"/>
      </StateProvider>
    </>
  );
}