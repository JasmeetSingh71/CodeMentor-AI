// import axios from "axios"

// const axiosClient =  axios.create({
//     baseURL: 'http://localhost:7001',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });


// export default axiosClient;


import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;


console.log(import.meta.env.VITE_API_URL);
