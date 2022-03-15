import axios from "axios";
import env from "react-dotenv"
import {setEndpoint, getEndpoint} from "./localStorage";

const getIt = () : string => {
    try {
        if (getEndpoint().endpoint === null || getEndpoint().endpoint === undefined) {
            if (env.BASE_URL !== undefined) {
                setEndpoint({endpoint: env.BASE_URL.toString()})
                return env.BASE_URL.toString()
            }
        } else {
            return getEndpoint().endpoint
        }
    } catch(err) {
        if (env.BASE_URL !== undefined)
            return env.BASE_URL.toString()
    }
    return env.BASE_URL.toString()
}

// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:8080"
// })

export const axiosInstance = axios.create({
    baseURL: getIt()
})
