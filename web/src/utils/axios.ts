import axios from "axios";
// import {setEndpoint, getEndpoint} from "./localStorage";

// const getIt = () : string => {
//     try {
//         if (getEndpoint().endpoint === null || getEndpoint().endpoint === undefined) {
//             if (process.env.REACT_APP_BASE_URL !== undefined) {
//                 setEndpoint({endpoint: process.env.REACT_APP_BASE_URL.toString()})
//                 return process.env.REACT_APP_BASE_URL.toString()
//             }
//         } else {
//             return getEndpoint().endpoint
//         }
//     } catch(err) {
//         if (process.env.REACT_APP_BASE_URL !== undefined)
//             return process.env.REACT_APP_BASE_URL.toString()
//     }
//     return "error"
// }

// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:8080"
// })

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/"
})
